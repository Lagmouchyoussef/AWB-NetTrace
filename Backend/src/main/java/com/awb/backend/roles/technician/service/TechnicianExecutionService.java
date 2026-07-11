package com.awb.backend.roles.technician.service;

import com.awb.backend.core.dto.InterventionResponse;
import com.awb.backend.core.entity.ChecklistTemplateItem;
import com.awb.backend.core.entity.Device;
import com.awb.backend.core.entity.Intervention;
import com.awb.backend.core.entity.InterventionChecklistItem;
import com.awb.backend.core.entity.InterventionPhoto;
import com.awb.backend.core.entity.InterventionPhotoPhase;
import com.awb.backend.core.entity.InterventionStatus;
import com.awb.backend.core.entity.InterventionTechnicianNote;
import com.awb.backend.core.entity.Rack;
import com.awb.backend.core.entity.User;
import com.awb.backend.core.repository.ChecklistTemplateItemRepository;
import com.awb.backend.core.repository.DeviceRepository;
import com.awb.backend.core.repository.InterventionChecklistItemRepository;
import com.awb.backend.core.repository.InterventionPhotoRepository;
import com.awb.backend.core.repository.InterventionRepository;
import com.awb.backend.core.repository.InterventionTechnicianNoteRepository;
import com.awb.backend.core.repository.UserRepository;
import com.awb.backend.roles.superadmin.service.InterventionService;
import com.awb.backend.roles.technician.dto.ChecklistItemResponse;
import com.awb.backend.roles.technician.dto.NoteResponse;
import com.awb.backend.roles.technician.dto.PhotoResponse;
import com.awb.backend.roles.technician.dto.RackElevationDeviceResponse;
import com.awb.backend.roles.technician.dto.RackElevationResponse;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

// Everything a technician does on their own assigned intervention: checklist progress, photo
// evidence, free-text notes, and the SCHEDULED -> IN_PROGRESS -> COMPLETED status walk. Every
// method re-checks assignment ownership itself (never trusts a previously-loaded Intervention
// from a different call) and a completed/cancelled intervention becomes read-only for all of
// checklist/photos/notes - enforced here, not just hidden in the UI, per the audit-immutability
// requirement for intervention evidence.
@Service
public class TechnicianExecutionService {

  private final InterventionRepository interventionRepository;
  private final ChecklistTemplateItemRepository templateRepository;
  private final InterventionChecklistItemRepository checklistItemRepository;
  private final InterventionPhotoRepository photoRepository;
  private final InterventionTechnicianNoteRepository noteRepository;
  private final DeviceRepository deviceRepository;
  private final UserRepository userRepository;
  private final InterventionPhotoStorage photoStorage;
  private final InterventionService interventionService;

  public TechnicianExecutionService(
      InterventionRepository interventionRepository,
      ChecklistTemplateItemRepository templateRepository,
      InterventionChecklistItemRepository checklistItemRepository,
      InterventionPhotoRepository photoRepository,
      InterventionTechnicianNoteRepository noteRepository,
      DeviceRepository deviceRepository,
      UserRepository userRepository,
      InterventionPhotoStorage photoStorage,
      InterventionService interventionService) {
    this.interventionRepository = interventionRepository;
    this.templateRepository = templateRepository;
    this.checklistItemRepository = checklistItemRepository;
    this.photoRepository = photoRepository;
    this.noteRepository = noteRepository;
    this.deviceRepository = deviceRepository;
    this.userRepository = userRepository;
    this.photoStorage = photoStorage;
    this.interventionService = interventionService;
  }

  // ---- checklist ----

  @Transactional
  public List<ChecklistItemResponse> getChecklist(Long interventionId, String technicianUsername) {
    Intervention intervention = getAssignedOrThrow(interventionId, technicianUsername);
    List<InterventionChecklistItem> items =
        checklistItemRepository.findByInterventionIdOrderByStepOrderAsc(interventionId);
    if (items.isEmpty()) {
      items = generateChecklistFromTemplate(intervention);
    }
    return items.stream().map(this::toChecklistResponse).toList();
  }

  @Transactional
  public ChecklistItemResponse toggleChecklistItem(
      Long interventionId, Long itemId, boolean completed, String technicianUsername) {
    Intervention intervention = getAssignedOrThrow(interventionId, technicianUsername);
    requireNotLocked(intervention);
    InterventionChecklistItem item = findChecklistItemOrThrow(interventionId, itemId);
    item.setCompleted(completed);
    item.setCompletedAt(completed ? Instant.now() : null);
    return toChecklistResponse(checklistItemRepository.save(item));
  }

  private List<InterventionChecklistItem> generateChecklistFromTemplate(Intervention intervention) {
    List<ChecklistTemplateItem> template =
        templateRepository.findByInterventionTypeOrderByStepOrderAsc(
            intervention.getInterventionType());
    List<InterventionChecklistItem> generated =
        template.stream()
            .map(
                templateItem -> {
                  InterventionChecklistItem item = new InterventionChecklistItem();
                  item.setIntervention(intervention);
                  item.setStepOrder(templateItem.getStepOrder());
                  item.setLabel(templateItem.getLabel());
                  item.setCompleted(false);
                  return item;
                })
            .toList();
    return checklistItemRepository.saveAll(generated);
  }

  private InterventionChecklistItem findChecklistItemOrThrow(Long interventionId, Long itemId) {
    InterventionChecklistItem item =
        checklistItemRepository
            .findById(itemId)
            .orElseThrow(
                () ->
                    new ResponseStatusException(HttpStatus.NOT_FOUND, "Checklist item not found."));
    if (!item.getIntervention().getId().equals(interventionId)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Checklist item not found.");
    }
    return item;
  }

  // ---- photos ----

  public record PhotoFile(byte[] bytes, String contentType) {}

  @Transactional(readOnly = true)
  public List<PhotoResponse> listPhotos(Long interventionId, String technicianUsername) {
    getAssignedOrThrow(interventionId, technicianUsername);
    return photoRepository.findByInterventionIdOrderByCreatedAtAsc(interventionId).stream()
        .map(this::toPhotoResponse)
        .toList();
  }

  @Transactional
  public PhotoResponse uploadPhoto(
      Long interventionId,
      InterventionPhotoPhase phase,
      MultipartFile file,
      String technicianUsername) {
    Intervention intervention = getAssignedOrThrow(interventionId, technicianUsername);
    requireNotLocked(intervention);
    User technician = resolveUser(technicianUsername);
    String storedFileName = photoStorage.store(file);
    InterventionPhoto photo = new InterventionPhoto();
    photo.setIntervention(intervention);
    photo.setPhase(phase);
    photo.setStoredFileName(storedFileName);
    photo.setContentType(file.getContentType());
    photo.setUploadedBy(technician);
    photo.setCreatedAt(Instant.now());
    return toPhotoResponse(photoRepository.save(photo));
  }

  @Transactional(readOnly = true)
  public PhotoFile readPhotoFile(Long interventionId, Long photoId, String technicianUsername) {
    getAssignedOrThrow(interventionId, technicianUsername);
    InterventionPhoto photo = findPhotoOrThrow(interventionId, photoId);
    return new PhotoFile(photoStorage.read(photo.getStoredFileName()), photo.getContentType());
  }

  @Transactional
  public void deletePhoto(Long interventionId, Long photoId, String technicianUsername) {
    Intervention intervention = getAssignedOrThrow(interventionId, technicianUsername);
    requireNotLocked(intervention);
    InterventionPhoto photo = findPhotoOrThrow(interventionId, photoId);
    photoStorage.delete(photo.getStoredFileName());
    photoRepository.delete(photo);
  }

  private InterventionPhoto findPhotoOrThrow(Long interventionId, Long photoId) {
    InterventionPhoto photo =
        photoRepository
            .findById(photoId)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Photo not found."));
    if (!photo.getIntervention().getId().equals(interventionId)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Photo not found.");
    }
    return photo;
  }

  // ---- notes ----

  @Transactional(readOnly = true)
  public List<NoteResponse> listNotes(Long interventionId, String technicianUsername) {
    getAssignedOrThrow(interventionId, technicianUsername);
    return noteRepository.findByInterventionIdOrderByCreatedAtDesc(interventionId).stream()
        .map(this::toNoteResponse)
        .toList();
  }

  @Transactional
  public NoteResponse createNote(Long interventionId, String body, String technicianUsername) {
    Intervention intervention = getAssignedOrThrow(interventionId, technicianUsername);
    requireNotLocked(intervention);
    User technician = resolveUser(technicianUsername);
    Instant now = Instant.now();
    InterventionTechnicianNote note = new InterventionTechnicianNote();
    note.setIntervention(intervention);
    note.setAuthor(technician);
    note.setBody(body);
    note.setCreatedAt(now);
    note.setUpdatedAt(now);
    return toNoteResponse(noteRepository.save(note));
  }

  @Transactional
  public NoteResponse updateNote(
      Long interventionId, Long noteId, String body, String technicianUsername) {
    Intervention intervention = getAssignedOrThrow(interventionId, technicianUsername);
    requireNotLocked(intervention);
    InterventionTechnicianNote note =
        findOwnNoteOrThrow(interventionId, noteId, technicianUsername);
    note.setBody(body);
    note.setUpdatedAt(Instant.now());
    return toNoteResponse(noteRepository.save(note));
  }

  @Transactional
  public void deleteNote(Long interventionId, Long noteId, String technicianUsername) {
    Intervention intervention = getAssignedOrThrow(interventionId, technicianUsername);
    requireNotLocked(intervention);
    InterventionTechnicianNote note =
        findOwnNoteOrThrow(interventionId, noteId, technicianUsername);
    noteRepository.delete(note);
  }

  private InterventionTechnicianNote findOwnNoteOrThrow(
      Long interventionId, Long noteId, String technicianUsername) {
    InterventionTechnicianNote note =
        noteRepository
            .findById(noteId)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found."));
    if (!note.getIntervention().getId().equals(interventionId)
        || !note.getAuthor().getUsername().equals(technicianUsername)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found.");
    }
    return note;
  }

  // ---- status transitions ----

  @Transactional
  public InterventionResponse start(Long interventionId, String technicianUsername) {
    Intervention intervention = getAssignedOrThrow(interventionId, technicianUsername);
    if (intervention.getStatus() != InterventionStatus.SCHEDULED) {
      throw new ResponseStatusException(
          HttpStatus.CONFLICT, "Only a scheduled intervention can be started.");
    }
    intervention.setStatus(InterventionStatus.IN_PROGRESS);
    intervention.setUpdatedAt(Instant.now());
    interventionRepository.save(intervention);
    return interventionService.getById(interventionId);
  }

  @Transactional
  public InterventionResponse complete(Long interventionId, String technicianUsername) {
    Intervention intervention = getAssignedOrThrow(interventionId, technicianUsername);
    if (intervention.getStatus() != InterventionStatus.IN_PROGRESS) {
      throw new ResponseStatusException(
          HttpStatus.CONFLICT, "Only an in-progress intervention can be completed.");
    }
    long incomplete =
        checklistItemRepository.countByInterventionIdAndCompletedFalse(interventionId);
    if (incomplete > 0) {
      throw new ResponseStatusException(
          HttpStatus.CONFLICT, "All checklist steps must be completed before closing.");
    }
    Instant now = Instant.now();
    intervention.setStatus(InterventionStatus.COMPLETED);
    intervention.setCompletedAt(now);
    intervention.setUpdatedAt(now);
    interventionRepository.save(intervention);
    return interventionService.getById(interventionId);
  }

  // ---- rack elevation ----

  @Transactional(readOnly = true)
  public RackElevationResponse getRackElevation(Long interventionId, String technicianUsername) {
    Intervention intervention = getAssignedOrThrow(interventionId, technicianUsername);
    Device targetDevice = intervention.getDevice();
    Rack rack = targetDevice.getRack();
    List<Device> devicesInRack = deviceRepository.findByRackIdAndDeletedFalse(rack.getId());

    RackElevationResponse response = new RackElevationResponse();
    response.setRackName(rack.getName());
    response.setRackHeightU(rack.getHeightU());
    response.setDevices(
        devicesInRack.stream()
            .map(
                device -> {
                  RackElevationDeviceResponse deviceResponse = new RackElevationDeviceResponse();
                  deviceResponse.setId(device.getId());
                  deviceResponse.setName(device.getName());
                  deviceResponse.setDeviceType(device.getDeviceType());
                  deviceResponse.setPositionUStart(device.getPositionUStart());
                  deviceResponse.setHeightU(device.getHeightU());
                  deviceResponse.setTarget(device.getId().equals(targetDevice.getId()));
                  return deviceResponse;
                })
            .toList());
    return response;
  }

  // ---- shared helpers ----

  // 404 (not 403) on a foreign intervention too, so a technician probing another tech's
  // intervention id via direct URL can't even confirm the record exists.
  private Intervention getAssignedOrThrow(Long interventionId, String technicianUsername) {
    Intervention intervention =
        interventionRepository
            .findById(interventionId)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Intervention not found."));
    User assignedTechnician = intervention.getAssignedTechnician();
    if (intervention.isDeleted()
        || assignedTechnician == null
        || !assignedTechnician.getUsername().equals(technicianUsername)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Intervention not found.");
    }
    return intervention;
  }

  private void requireNotLocked(Intervention intervention) {
    if (intervention.getStatus() == InterventionStatus.COMPLETED
        || intervention.getStatus() == InterventionStatus.CANCELLED) {
      throw new ResponseStatusException(
          HttpStatus.CONFLICT,
          "This intervention is closed - its checklist, photos and notes are read-only.");
    }
  }

  private User resolveUser(String username) {
    return userRepository
        .findByUsername(username)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found."));
  }

  private ChecklistItemResponse toChecklistResponse(InterventionChecklistItem item) {
    ChecklistItemResponse response = new ChecklistItemResponse();
    response.setId(item.getId());
    response.setStepOrder(item.getStepOrder());
    response.setLabel(item.getLabel());
    response.setCompleted(item.isCompleted());
    response.setCompletedAt(item.getCompletedAt());
    return response;
  }

  private PhotoResponse toPhotoResponse(InterventionPhoto photo) {
    PhotoResponse response = new PhotoResponse();
    response.setId(photo.getId());
    response.setPhase(photo.getPhase());
    response.setContentType(photo.getContentType());
    response.setUploadedByUsername(photo.getUploadedBy().getUsername());
    response.setCreatedAt(photo.getCreatedAt());
    return response;
  }

  private NoteResponse toNoteResponse(InterventionTechnicianNote note) {
    NoteResponse response = new NoteResponse();
    response.setId(note.getId());
    response.setBody(note.getBody());
    response.setAuthorUsername(note.getAuthor().getUsername());
    response.setCreatedAt(note.getCreatedAt());
    response.setUpdatedAt(note.getUpdatedAt());
    return response;
  }
}

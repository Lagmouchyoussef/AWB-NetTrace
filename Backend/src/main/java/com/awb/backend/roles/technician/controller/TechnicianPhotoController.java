package com.awb.backend.roles.technician.controller;

import com.awb.backend.core.entity.InterventionPhotoPhase;
import com.awb.backend.roles.technician.dto.PhotoResponse;
import com.awb.backend.roles.technician.service.TechnicianExecutionService;
import com.awb.backend.roles.technician.service.TechnicianExecutionService.PhotoFile;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/roles/technician/interventions/{interventionId}/photos")
public class TechnicianPhotoController {

  private final TechnicianExecutionService executionService;

  public TechnicianPhotoController(TechnicianExecutionService executionService) {
    this.executionService = executionService;
  }

  @GetMapping
  public List<PhotoResponse> list(
      @PathVariable Long interventionId, Authentication authentication) {
    return executionService.listPhotos(interventionId, authentication.getName());
  }

  @PostMapping
  public PhotoResponse upload(
      @PathVariable Long interventionId,
      @RequestParam InterventionPhotoPhase phase,
      @RequestPart MultipartFile file,
      Authentication authentication) {
    return executionService.uploadPhoto(interventionId, phase, file, authentication.getName());
  }

  @GetMapping("/{photoId}/file")
  public ResponseEntity<byte[]> getFile(
      @PathVariable Long interventionId,
      @PathVariable Long photoId,
      Authentication authentication) {
    PhotoFile photoFile =
        executionService.readPhotoFile(interventionId, photoId, authentication.getName());
    return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType(photoFile.contentType()))
        .body(photoFile.bytes());
  }

  @DeleteMapping("/{photoId}")
  public void delete(
      @PathVariable Long interventionId,
      @PathVariable Long photoId,
      Authentication authentication) {
    executionService.deletePhoto(interventionId, photoId, authentication.getName());
  }
}

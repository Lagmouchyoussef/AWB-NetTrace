package com.awb.backend.roles.technician.service;

import com.awb.backend.core.entity.TechnicianPersonalNote;
import com.awb.backend.core.entity.User;
import com.awb.backend.core.repository.TechnicianPersonalNoteRepository;
import com.awb.backend.core.repository.UserRepository;
import com.awb.backend.roles.technician.dto.PersonalNoteRequest;
import com.awb.backend.roles.technician.dto.PersonalNoteResponse;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

// Standalone notes owned by the authenticated technician, independent of any intervention - see
// TechnicianExecutionService's "---- notes ----" section for the intervention-scoped counterpart
// this mirrors (same resolveUser/findOwnOrThrow shape, just without an intervention to scope by).
@Service
public class TechnicianPersonalNoteService {

  private final TechnicianPersonalNoteRepository noteRepository;
  private final UserRepository userRepository;

  public TechnicianPersonalNoteService(
      TechnicianPersonalNoteRepository noteRepository, UserRepository userRepository) {
    this.noteRepository = noteRepository;
    this.userRepository = userRepository;
  }

  @Transactional(readOnly = true)
  public List<PersonalNoteResponse> list(String username) {
    User author = resolveUser(username);
    return noteRepository.findByAuthorIdOrderByUpdatedAtDesc(author.getId()).stream()
        .map(this::toResponse)
        .toList();
  }

  @Transactional
  public PersonalNoteResponse create(String username, PersonalNoteRequest request) {
    User author = resolveUser(username);
    Instant now = Instant.now();
    TechnicianPersonalNote note = new TechnicianPersonalNote();
    note.setAuthor(author);
    note.setTitle(request.getTitle());
    note.setBody(request.getBody());
    note.setCreatedAt(now);
    note.setUpdatedAt(now);
    return toResponse(noteRepository.save(note));
  }

  @Transactional
  public PersonalNoteResponse update(String username, Long noteId, PersonalNoteRequest request) {
    TechnicianPersonalNote note = findOwnNoteOrThrow(noteId, username);
    note.setTitle(request.getTitle());
    note.setBody(request.getBody());
    note.setUpdatedAt(Instant.now());
    return toResponse(noteRepository.save(note));
  }

  @Transactional
  public void delete(String username, Long noteId) {
    TechnicianPersonalNote note = findOwnNoteOrThrow(noteId, username);
    noteRepository.delete(note);
  }

  private TechnicianPersonalNote findOwnNoteOrThrow(Long noteId, String username) {
    TechnicianPersonalNote note =
        noteRepository
            .findById(noteId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found."));
    if (!note.getAuthor().getUsername().equals(username)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found.");
    }
    return note;
  }

  private User resolveUser(String username) {
    return userRepository
        .findByUsername(username)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found."));
  }

  private PersonalNoteResponse toResponse(TechnicianPersonalNote note) {
    PersonalNoteResponse response = new PersonalNoteResponse();
    response.setId(note.getId());
    response.setTitle(note.getTitle());
    response.setBody(note.getBody());
    response.setCreatedAt(note.getCreatedAt());
    response.setUpdatedAt(note.getUpdatedAt());
    return response;
  }
}

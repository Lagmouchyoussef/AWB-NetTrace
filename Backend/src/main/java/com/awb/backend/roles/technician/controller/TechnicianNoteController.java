package com.awb.backend.roles.technician.controller;

import com.awb.backend.roles.technician.dto.NoteRequest;
import com.awb.backend.roles.technician.dto.NoteResponse;
import com.awb.backend.roles.technician.service.TechnicianExecutionService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roles/technician/interventions/{interventionId}/notes")
public class TechnicianNoteController {

  private final TechnicianExecutionService executionService;

  public TechnicianNoteController(TechnicianExecutionService executionService) {
    this.executionService = executionService;
  }

  @GetMapping
  public List<NoteResponse> list(@PathVariable Long interventionId, Authentication authentication) {
    return executionService.listNotes(interventionId, authentication.getName());
  }

  @PostMapping
  public NoteResponse create(
      @PathVariable Long interventionId,
      @Valid @RequestBody NoteRequest request,
      Authentication authentication) {
    return executionService.createNote(interventionId, request.getBody(), authentication.getName());
  }

  @PutMapping("/{noteId}")
  public NoteResponse update(
      @PathVariable Long interventionId,
      @PathVariable Long noteId,
      @Valid @RequestBody NoteRequest request,
      Authentication authentication) {
    return executionService.updateNote(
        interventionId, noteId, request.getBody(), authentication.getName());
  }

  @DeleteMapping("/{noteId}")
  public void delete(
      @PathVariable Long interventionId, @PathVariable Long noteId, Authentication authentication) {
    executionService.deleteNote(interventionId, noteId, authentication.getName());
  }
}

package com.awb.backend.roles.technician.controller;

import com.awb.backend.roles.technician.dto.PersonalNoteRequest;
import com.awb.backend.roles.technician.dto.PersonalNoteResponse;
import com.awb.backend.roles.technician.service.TechnicianPersonalNoteService;
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
@RequestMapping("/api/roles/technician/personal-notes")
public class TechnicianPersonalNoteController {

  private final TechnicianPersonalNoteService noteService;

  public TechnicianPersonalNoteController(TechnicianPersonalNoteService noteService) {
    this.noteService = noteService;
  }

  @GetMapping
  public List<PersonalNoteResponse> list(Authentication authentication) {
    return noteService.list(authentication.getName());
  }

  @PostMapping
  public PersonalNoteResponse create(
      @Valid @RequestBody PersonalNoteRequest request, Authentication authentication) {
    return noteService.create(authentication.getName(), request);
  }

  @PutMapping("/{noteId}")
  public PersonalNoteResponse update(
      @PathVariable Long noteId,
      @Valid @RequestBody PersonalNoteRequest request,
      Authentication authentication) {
    return noteService.update(authentication.getName(), noteId, request);
  }

  @DeleteMapping("/{noteId}")
  public void delete(@PathVariable Long noteId, Authentication authentication) {
    noteService.delete(authentication.getName(), noteId);
  }
}

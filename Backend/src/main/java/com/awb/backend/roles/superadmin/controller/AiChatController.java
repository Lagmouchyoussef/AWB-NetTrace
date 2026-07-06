package com.awb.backend.roles.superadmin.controller;

import com.awb.backend.core.dto.AiChatRequest;
import com.awb.backend.core.dto.AiChatResponse;
import com.awb.backend.roles.superadmin.service.AiChatService;
import jakarta.validation.Valid;
import java.security.Principal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roles/super-admin/ai/chat")
public class AiChatController {

  private final AiChatService aiChatService;

  public AiChatController(AiChatService aiChatService) {
    this.aiChatService = aiChatService;
  }

  @PostMapping("/messages")
  public AiChatResponse sendMessage(@Valid @RequestBody AiChatRequest request, Principal principal) {
    return aiChatService.send(request, principal.getName());
  }
}

package com.awb.backend.roles.superadmin.service;

import com.awb.backend.ai.AiChatOrchestrator;
import com.awb.backend.ai.AiChatTurnResult;
import com.awb.backend.ai.AnthropicGateway;
import com.awb.backend.core.dto.AiChatRequest;
import com.awb.backend.core.dto.AiChatResponse;
import org.springframework.stereotype.Service;

@Service
public class AiChatService {

  private final AnthropicGateway anthropicGateway;
  private final AiChatOrchestrator aiChatOrchestrator;
  private final AiSettingsService aiSettingsService;

  public AiChatService(
      AnthropicGateway anthropicGateway,
      AiChatOrchestrator aiChatOrchestrator,
      AiSettingsService aiSettingsService) {
    this.anthropicGateway = anthropicGateway;
    this.aiChatOrchestrator = aiChatOrchestrator;
    this.aiSettingsService = aiSettingsService;
  }

  public AiChatResponse send(AiChatRequest request, String actorUsername) {
    AiChatResponse response = new AiChatResponse();
    boolean assistantEnabled = aiSettingsService.get().isAssistantEnabled();
    boolean configured = anthropicGateway.isConfigured();
    response.setAiConfigured(configured);
    response.setAutonomousActionsEnabled(aiSettingsService.get().isAutonomousActionsEnabled());

    if (!assistantEnabled) {
      response.setReply("The AI assistant is currently turned off by an administrator.");
      return response;
    }
    if (!configured) {
      response.setReply(
          "The AI assistant is not configured yet. An administrator needs to set an "
              + "Anthropic API key.");
      return response;
    }

    AiChatTurnResult result = aiChatOrchestrator.run(request.getMessages(), actorUsername);
    response.setReply(result.getReply());
    response.setToolCallSummaries(result.getToolCallSummaries());
    return response;
  }
}

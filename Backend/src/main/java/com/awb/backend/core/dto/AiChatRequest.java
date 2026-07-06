package com.awb.backend.core.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

public class AiChatRequest {

  @NotEmpty
  @Size(max = 40)
  @Valid
  private List<AiChatMessage> messages;

  public List<AiChatMessage> getMessages() {
    return messages;
  }

  public void setMessages(List<AiChatMessage> messages) {
    this.messages = messages;
  }
}

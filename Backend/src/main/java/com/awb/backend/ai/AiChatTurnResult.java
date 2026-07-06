package com.awb.backend.ai;

import java.util.List;

// Result of one chat turn: the assistant's final text reply, plus the names of any tools it
// called along the way (for the response's toolCallSummaries field).
public final class AiChatTurnResult {

  private final String reply;
  private final List<String> toolCallSummaries;

  public AiChatTurnResult(String reply, List<String> toolCallSummaries) {
    this.reply = reply;
    this.toolCallSummaries = toolCallSummaries;
  }

  public String getReply() {
    return reply;
  }

  public List<String> getToolCallSummaries() {
    return toolCallSummaries;
  }
}

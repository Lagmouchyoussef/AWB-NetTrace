package com.awb.backend.core.dto;

import java.util.List;

public class AiChatResponse {

  private String reply;
  private boolean aiConfigured;
  private boolean autonomousActionsEnabled;
  private List<Long> insightIdsCreated;
  private List<String> toolCallSummaries;

  public String getReply() {
    return reply;
  }

  public void setReply(String reply) {
    this.reply = reply;
  }

  public boolean isAiConfigured() {
    return aiConfigured;
  }

  public void setAiConfigured(boolean aiConfigured) {
    this.aiConfigured = aiConfigured;
  }

  public boolean isAutonomousActionsEnabled() {
    return autonomousActionsEnabled;
  }

  public void setAutonomousActionsEnabled(boolean autonomousActionsEnabled) {
    this.autonomousActionsEnabled = autonomousActionsEnabled;
  }

  public List<Long> getInsightIdsCreated() {
    return insightIdsCreated;
  }

  public void setInsightIdsCreated(List<Long> insightIdsCreated) {
    this.insightIdsCreated = insightIdsCreated;
  }

  public List<String> getToolCallSummaries() {
    return toolCallSummaries;
  }

  public void setToolCallSummaries(List<String> toolCallSummaries) {
    this.toolCallSummaries = toolCallSummaries;
  }
}

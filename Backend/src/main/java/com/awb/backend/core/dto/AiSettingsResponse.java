package com.awb.backend.core.dto;

public class AiSettingsResponse {

  private boolean assistantEnabled;
  private boolean predictiveAnalysisEnabled;
  private boolean autonomousActionsEnabled;
  private boolean apiKeyConfigured;

  public boolean isAssistantEnabled() {
    return assistantEnabled;
  }

  public void setAssistantEnabled(boolean assistantEnabled) {
    this.assistantEnabled = assistantEnabled;
  }

  public boolean isPredictiveAnalysisEnabled() {
    return predictiveAnalysisEnabled;
  }

  public void setPredictiveAnalysisEnabled(boolean predictiveAnalysisEnabled) {
    this.predictiveAnalysisEnabled = predictiveAnalysisEnabled;
  }

  public boolean isAutonomousActionsEnabled() {
    return autonomousActionsEnabled;
  }

  public void setAutonomousActionsEnabled(boolean autonomousActionsEnabled) {
    this.autonomousActionsEnabled = autonomousActionsEnabled;
  }

  public boolean isApiKeyConfigured() {
    return apiKeyConfigured;
  }

  public void setApiKeyConfigured(boolean apiKeyConfigured) {
    this.apiKeyConfigured = apiKeyConfigured;
  }
}

package com.awb.backend.core.dto;

public class AiSettingsUpdateRequest {

  private Boolean assistantEnabled;
  private Boolean predictiveAnalysisEnabled;
  private Boolean autonomousActionsEnabled;

  public Boolean getAssistantEnabled() {
    return assistantEnabled;
  }

  public void setAssistantEnabled(Boolean assistantEnabled) {
    this.assistantEnabled = assistantEnabled;
  }

  public Boolean getPredictiveAnalysisEnabled() {
    return predictiveAnalysisEnabled;
  }

  public void setPredictiveAnalysisEnabled(Boolean predictiveAnalysisEnabled) {
    this.predictiveAnalysisEnabled = predictiveAnalysisEnabled;
  }

  public Boolean getAutonomousActionsEnabled() {
    return autonomousActionsEnabled;
  }

  public void setAutonomousActionsEnabled(Boolean autonomousActionsEnabled) {
    this.autonomousActionsEnabled = autonomousActionsEnabled;
  }
}

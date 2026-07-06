export interface AiSettings {
  assistantEnabled: boolean;
  predictiveAnalysisEnabled: boolean;
  autonomousActionsEnabled: boolean;
  apiKeyConfigured: boolean;
}

export interface AiSettingsUpdateRequest {
  assistantEnabled?: boolean;
  predictiveAnalysisEnabled?: boolean;
  autonomousActionsEnabled?: boolean;
}

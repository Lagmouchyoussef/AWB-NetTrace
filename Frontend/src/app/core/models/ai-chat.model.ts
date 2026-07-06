export interface AiChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiChatResponse {
  reply: string;
  aiConfigured: boolean;
  autonomousActionsEnabled: boolean;
  insightIdsCreated: number[] | null;
  toolCallSummaries: string[] | null;
}

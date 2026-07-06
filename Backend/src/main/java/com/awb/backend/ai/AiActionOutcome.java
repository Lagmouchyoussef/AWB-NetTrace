package com.awb.backend.ai;

// Result of an AiActionExecutor call - whether the action was actually applied or only
// logged as a pending recommendation, plus the AiInsight id and a tool_result message for
// the LLM to read back.
public final class AiActionOutcome {

  private final boolean applied;
  private final Long insightId;
  private final String message;

  private AiActionOutcome(boolean applied, Long insightId, String message) {
    this.applied = applied;
    this.insightId = insightId;
    this.message = message;
  }

  public static AiActionOutcome applied(Long insightId, String message) {
    return new AiActionOutcome(true, insightId, message);
  }

  public static AiActionOutcome loggedAsRecommendation(Long insightId, String message) {
    return new AiActionOutcome(false, insightId, message);
  }

  public boolean isApplied() {
    return applied;
  }

  public Long getInsightId() {
    return insightId;
  }

  public String getMessage() {
    return message;
  }
}

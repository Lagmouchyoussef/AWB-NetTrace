package com.awb.backend.ai;

// Thrown when a caller tries to use the AI layer (chat, predictive analysis) but no
// ANTHROPIC_API_KEY is configured. Callers catch this at the service boundary and degrade
// gracefully instead of letting it surface as a 500.
public class AiNotConfiguredException extends RuntimeException {

  public AiNotConfiguredException() {
    super("AI assistant is not configured: ANTHROPIC_API_KEY is not set.");
  }
}

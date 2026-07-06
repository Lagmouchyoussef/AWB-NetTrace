package com.awb.backend.ai;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

// The only place that touches the Anthropic SDK client. The client is built lazily on first
// real use (never at Spring context startup), so a missing ANTHROPIC_API_KEY never prevents
// the backend from starting - callers check isConfigured() and degrade gracefully instead.
@Component
public class AnthropicGateway {

  private final String apiKey;
  private final String model;
  private volatile AnthropicClient client;

  public AnthropicGateway(
      @Value("${anthropic.api-key:}") String apiKey,
      @Value("${anthropic.model:claude-opus-4-8}") String model) {
    this.apiKey = apiKey;
    this.model = model;
  }

  public boolean isConfigured() {
    return apiKey != null && !apiKey.isBlank();
  }

  public String model() {
    return model;
  }

  public Message createMessage(MessageCreateParams params) {
    if (!isConfigured()) {
      throw new AiNotConfiguredException();
    }
    return client().messages().create(params);
  }

  private AnthropicClient client() {
    AnthropicClient current = client;
    if (current == null) {
      synchronized (this) {
        current = client;
        if (current == null) {
          current = AnthropicOkHttpClient.builder().apiKey(apiKey).build();
          client = current;
        }
      }
    }
    return current;
  }
}

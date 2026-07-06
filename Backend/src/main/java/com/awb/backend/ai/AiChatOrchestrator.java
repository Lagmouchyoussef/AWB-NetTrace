package com.awb.backend.ai;

import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.MessageParam;
import com.anthropic.models.messages.StopReason;
import com.anthropic.models.messages.TextBlockParam;
import com.anthropic.models.messages.ToolResultBlockParam;
import com.anthropic.models.messages.ToolUseBlock;
import com.awb.backend.core.dto.AiChatMessage;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;

// Runs the manual Anthropic Messages-API tool-use loop for the chat assistant: build request ->
// dispatch tool_use blocks -> append tool_results -> repeat until end_turn, capped at 6
// iterations. This is a workflow-with-tool-use case (thin repository-backed tools, no sandbox),
// so a manual loop is used rather than Managed Agents.
@Component
public class AiChatOrchestrator {

  private static final int MAX_TOOL_ITERATIONS = 6;
  private static final long MAX_TOKENS = 2048L;

  private static final String SYSTEM_PROMPT =
      """
      You are the AWB-NetTrace AI Operations Assistant, embedded in a data-center \
      infrastructure management platform (super-admin role only).

      Data freshness: never answer questions about specific infrastructure state from \
      memory or assumption - always call the relevant read tool first. If a tool call \
      fails or returns no data, say so plainly rather than guessing.

      Scope: this platform has no physical/electrical hardware integration. "Taking \
      action" here means: changing a Device/Rack/Room's software status, creating an \
      Intervention ticket, or both - never a real circuit breaker or physical control.

      Safety: when a situation calls for remediation, always call the appropriate action \
      tool (create_urgent_intervention / set_entity_status) rather than only describing \
      the action in text - this is what creates the auditable record, even when \
      autonomous actions are currently disabled and the action tool only logs a \
      recommendation for human review. Never claim to have taken an action you did not \
      call a tool for.

      Tone: concise, operational, cite entity names/ids when referencing specific \
      infrastructure.
      """;

  private final AnthropicGateway anthropicGateway;
  private final AiToolExecutor aiToolExecutor;

  public AiChatOrchestrator(AnthropicGateway anthropicGateway, AiToolExecutor aiToolExecutor) {
    this.anthropicGateway = anthropicGateway;
    this.aiToolExecutor = aiToolExecutor;
  }

  public AiChatTurnResult run(List<AiChatMessage> history, String actorUsername) {
    List<MessageParam> transcript = new ArrayList<>();
    for (AiChatMessage message : history) {
      MessageParam.Role role =
          "assistant".equals(message.getRole())
              ? MessageParam.Role.ASSISTANT
              : MessageParam.Role.USER;
      transcript.add(
          MessageParam.builder()
              .role(role)
              .contentOfBlockParams(
                  List.of(
                      ContentBlockParam.ofText(
                          TextBlockParam.builder().text(message.getContent()).build())))
              .build());
    }

    List<String> toolCallSummaries = new ArrayList<>();
    for (int iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
      MessageCreateParams params =
          MessageCreateParams.builder()
              .model(anthropicGateway.model())
              .maxTokens(MAX_TOKENS)
              .system(SYSTEM_PROMPT)
              .tools(buildToolUnions())
              .messages(transcript)
              .build();

      Message response = anthropicGateway.createMessage(params);

      if (response.stopReason().isPresent() && response.stopReason().get() == StopReason.TOOL_USE) {
        List<ContentBlockParam> toolResults = new ArrayList<>();
        for (var block : response.content()) {
          if (block.toolUse().isPresent()) {
            ToolUseBlock toolUse = block.toolUse().get();
            String resultJson =
                aiToolExecutor.execute(toolUse.name(), toolUse._input(), actorUsername);
            toolCallSummaries.add(toolUse.name());
            toolResults.add(
                ContentBlockParam.ofToolResult(
                    ToolResultBlockParam.builder()
                        .toolUseId(toolUse.id())
                        .content(resultJson)
                        .build()));
          }
        }
        transcript.add(
            MessageParam.builder()
                .role(MessageParam.Role.ASSISTANT)
                .contentOfBlockParams(toBlockParams(response))
                .build());
        transcript.add(
            MessageParam.builder()
                .role(MessageParam.Role.USER)
                .contentOfBlockParams(toolResults)
                .build());
      } else {
        String reply =
            response.content().stream()
                .flatMap(block -> block.text().stream())
                .map(text -> text.text())
                .reduce("", (a, b) -> a + b);
        return new AiChatTurnResult(reply, toolCallSummaries);
      }
    }
    return new AiChatTurnResult(
        "I've made several tool calls but couldn't finish - please try rephrasing your request.",
        toolCallSummaries);
  }

  private List<ContentBlockParam> toBlockParams(Message response) {
    List<ContentBlockParam> blocks = new ArrayList<>();
    for (var block : response.content()) {
      block
          .text()
          .ifPresent(
              t ->
                  blocks.add(
                      ContentBlockParam.ofText(TextBlockParam.builder().text(t.text()).build())));
      block
          .toolUse()
          .ifPresent(
              tu ->
                  blocks.add(
                      ContentBlockParam.ofToolUse(
                          com.anthropic.models.messages.ToolUseBlockParam.builder()
                              .id(tu.id())
                              .name(tu.name())
                              .input(tu._input())
                              .build())));
    }
    return blocks;
  }

  private List<com.anthropic.models.messages.ToolUnion> buildToolUnions() {
    List<com.anthropic.models.messages.ToolUnion> unions = new ArrayList<>();
    AiToolDefinitions.readTools()
        .forEach(t -> unions.add(com.anthropic.models.messages.ToolUnion.ofTool(t)));
    AiToolDefinitions.actionTools()
        .forEach(t -> unions.add(com.anthropic.models.messages.ToolUnion.ofTool(t)));
    return unions;
  }
}

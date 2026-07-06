package com.awb.backend.ai;

import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.Tool;
import java.util.List;
import java.util.Map;

// Builds the JSON-schema tool definitions shared by the chat assistant and the predictive
// analysis job. Defined once here so both callers see an identical tool surface.
public final class AiToolDefinitions {

  private AiToolDefinitions() {}

  public static List<Tool> readTools() {
    return List.of(
        tool("list_datacenters", "List all datacenters with their status, tier, and location.", Map.of()),
        tool(
            "list_rooms",
            "List rooms, optionally filtered by datacenter id.",
            Map.of("datacenterId", stringProp("Optional datacenter id to filter by."))),
        tool(
            "list_racks",
            "List racks with power capacity and current draw, optionally filtered by room id.",
            Map.of("roomId", stringProp("Optional room id to filter by."))),
        tool(
            "list_devices",
            "List devices, optionally filtered by rack id.",
            Map.of("rackId", stringProp("Optional rack id to filter by."))),
        tool(
            "list_anomalies",
            "List anomaly detections, optionally filtered by status "
                + "(OPEN, ACKNOWLEDGED, RESOLVED, FALSE_POSITIVE).",
            Map.of("status", stringProp("Optional status filter."))),
        tool(
            "list_interventions",
            "List maintenance/incident interventions, optionally filtered by status "
                + "(SCHEDULED, IN_PROGRESS, ON_HOLD, COMPLETED, CANCELLED).",
            Map.of("status", stringProp("Optional status filter."))),
        tool(
            "list_ai_insights",
            "List AI-generated insights (risk predictions, recommendations, autonomous "
                + "action logs), optionally filtered by status (NEW, ACKNOWLEDGED, APPLIED, "
                + "DISMISSED).",
            Map.of("status", stringProp("Optional status filter."))),
        tool(
            "search_audit_log",
            "Search recent audit log entries describing what changed in the platform.",
            Map.of("search", stringProp("Optional free-text search term."))),
        tool("get_dashboard_summary", "Get an aggregate summary of overall datacenter health.", Map.of()));
  }

  public static List<Tool> actionTools() {
    return List.of(
        Tool.builder()
            .name("create_urgent_intervention")
            .description(
                "Create a CRITICAL-priority intervention ticket for a device that needs "
                    + "urgent human attention. Always call this rather than only describing "
                    + "the action in text - this is what creates the auditable record.")
            .inputSchema(
                Tool.InputSchema.builder()
                    .properties(
                        Tool.InputSchema.Properties.builder()
                            .putAdditionalProperty(
                                "deviceId", stringProp("The id of the device needing attention."))
                            .putAdditionalProperty("title", stringProp("Short intervention title."))
                            .putAdditionalProperty(
                                "description", stringProp("What was observed and why it's urgent."))
                            .build())
                    .required(List.of("deviceId", "title", "description"))
                    .build())
            .build(),
        Tool.builder()
            .name("set_entity_status")
            .description(
                "Change a Device, Rack, or Room's software status (e.g. to MAINTENANCE) to "
                    + "logically take it out of service in the platform. This platform has no "
                    + "real physical/electrical hardware integration - this only changes the "
                    + "software record.")
            .inputSchema(
                Tool.InputSchema.builder()
                    .properties(
                        Tool.InputSchema.Properties.builder()
                            .putAdditionalProperty(
                                "entityType", enumProp("DEVICE", "RACK", "ROOM"))
                            .putAdditionalProperty("entityId", stringProp("The id of the entity."))
                            .putAdditionalProperty("newStatus", stringProp("The new status value."))
                            .putAdditionalProperty("reason", stringProp("Why this change is needed."))
                            .build())
                    .required(List.of("entityType", "entityId", "newStatus", "reason"))
                    .build())
            .build());
  }

  public static Tool reportPredictiveFindingsTool() {
    Map<String, JsonValue> findingSchema =
        Map.of(
            "type", JsonValue.from("array"),
            "items",
                JsonValue.from(
                    Map.of(
                        "type", "object",
                        "properties",
                            Map.of(
                                "entityType", Map.of("type", "string"),
                                "entityId", Map.of("type", "string"),
                                "entityName", Map.of("type", "string"),
                                "severity",
                                    Map.of(
                                        "type", "string",
                                        "enum", List.of("CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO")),
                                "title", Map.of("type", "string"),
                                "summary", Map.of("type", "string"),
                                "recommendedAction", Map.of("type", "string"),
                                "shouldAutoRemediate", Map.of("type", "boolean"),
                                "remediationType",
                                    Map.of(
                                        "type",
                                        "string",
                                        "enum",
                                        List.of(
                                            "SET_STATUS_MAINTENANCE",
                                            "CREATE_INTERVENTION",
                                            "NONE"))),
                        "required",
                            List.of(
                                "severity",
                                "title",
                                "summary",
                                "shouldAutoRemediate",
                                "remediationType"))));

    return Tool.builder()
        .name("report_predictive_findings")
        .description(
            "Report zero or more predictive risk findings from the supplied infrastructure "
                + "snapshot.")
        .inputSchema(
            Tool.InputSchema.builder()
                .properties(
                    Tool.InputSchema.Properties.builder()
                        .putAdditionalProperty("findings", JsonValue.from(findingSchema))
                        .build())
                .required(List.of("findings"))
                .build())
        .build();
  }

  private static Tool tool(String name, String description, Map<String, JsonValue> properties) {
    Tool.InputSchema.Properties.Builder propsBuilder = Tool.InputSchema.Properties.builder();
    properties.forEach(propsBuilder::putAdditionalProperty);
    return Tool.builder()
        .name(name)
        .description(description)
        .inputSchema(Tool.InputSchema.builder().properties(propsBuilder.build()).build())
        .build();
  }

  private static JsonValue stringProp(String description) {
    return JsonValue.from(Map.of("type", "string", "description", description));
  }

  private static JsonValue enumProp(String... values) {
    return JsonValue.from(Map.of("type", "string", "enum", List.of(values)));
  }
}

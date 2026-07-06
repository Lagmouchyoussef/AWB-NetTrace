package com.awb.backend.roles.superadmin.controller;

import com.awb.backend.ai.AiPredictiveAnalysisJob;
import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Test/verification endpoint - lets curl/Playwright trigger the predictive analysis job
// on-demand without waiting for the cron interval. Still SUPER_ADMIN-gated via the existing
// /api/roles/super-admin/** prefix, so no new security surface.
@RestController
@RequestMapping("/api/roles/super-admin/ai/predictive-analysis")
public class AiPredictiveAnalysisController {

  private final AiPredictiveAnalysisJob aiPredictiveAnalysisJob;

  public AiPredictiveAnalysisController(AiPredictiveAnalysisJob aiPredictiveAnalysisJob) {
    this.aiPredictiveAnalysisJob = aiPredictiveAnalysisJob;
  }

  @PostMapping("/run-now")
  public Map<String, Integer> runNow() {
    return Map.of("insightsCreated", aiPredictiveAnalysisJob.run());
  }
}

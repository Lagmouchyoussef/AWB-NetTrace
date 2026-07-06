package com.awb.backend.roles.superadmin.controller;

import com.awb.backend.core.dto.DashboardSummaryResponse;
import com.awb.backend.roles.superadmin.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roles/super-admin/dashboard")
public class DashboardController {

  private final DashboardService dashboardService;

  public DashboardController(DashboardService dashboardService) {
    this.dashboardService = dashboardService;
  }

  @GetMapping("/summary")
  public DashboardSummaryResponse getSummary() {
    return dashboardService.getSummary();
  }
}

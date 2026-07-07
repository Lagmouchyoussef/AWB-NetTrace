package com.awb.backend.roles.dcadmin.controller;

import com.awb.backend.core.dto.DashboardSummaryResponse;
import com.awb.backend.roles.superadmin.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Delegates to the exact same DashboardService Super Admin's dashboard uses - DC Admin sees
// the identical live KPIs/charts/activity feed, just gated to DC_ADMIN instead of SUPER_ADMIN.
@RestController
@RequestMapping("/api/roles/dc-admin/dashboard")
public class DcAdminDashboardController {

  private final DashboardService dashboardService;

  public DcAdminDashboardController(DashboardService dashboardService) {
    this.dashboardService = dashboardService;
  }

  @GetMapping("/summary")
  public DashboardSummaryResponse getSummary(@RequestParam(defaultValue = "14") int days) {
    return dashboardService.getSummary(days);
  }
}

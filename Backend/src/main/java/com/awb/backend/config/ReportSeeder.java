package com.awb.backend.config;

import com.awb.backend.core.entity.Report;
import com.awb.backend.core.entity.ReportFormat;
import com.awb.backend.core.entity.ReportSchedule;
import com.awb.backend.core.entity.ReportStatus;
import com.awb.backend.core.entity.ReportType;
import com.awb.backend.core.repository.ReportRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds a small demo report catalog on first startup (only if the table is empty). Dev/demo data
 * only.
 */
@Component
@Order(26)
public class ReportSeeder implements CommandLineRunner {

  private final ReportRepository reportRepository;

  public ReportSeeder(ReportRepository reportRepository) {
    this.reportRepository = reportRepository;
  }

  @Override
  public void run(String... args) {
    if (reportRepository.count() > 0) {
      return;
    }

    seed(
        "Inventaire complet des équipements",
        "RPT-01",
        ReportType.INVENTORY,
        ReportFormat.XLSX,
        ReportSchedule.WEEKLY,
        ReportStatus.ACTIVE,
        24);
    seed(
        "Capacité énergie et refroidissement",
        "RPT-02",
        ReportType.CAPACITY,
        ReportFormat.PDF,
        ReportSchedule.MONTHLY,
        ReportStatus.ACTIVE,
        72);
    seed(
        "Conformité et audit mensuel",
        "RPT-03",
        ReportType.COMPLIANCE,
        ReportFormat.PDF,
        ReportSchedule.MONTHLY,
        ReportStatus.ACTIVE,
        168);
    seed(
        "Disponibilité des liens SD-WAN",
        "RPT-04",
        ReportType.AVAILABILITY,
        ReportFormat.CSV,
        ReportSchedule.DAILY,
        ReportStatus.ACTIVE,
        12);
    seed(
        "Analyse de sécurité personnalisée",
        "RPT-05",
        ReportType.SECURITY,
        ReportFormat.PDF,
        ReportSchedule.ON_DEMAND,
        ReportStatus.DRAFT,
        -1);
  }

  private void seed(
      String name,
      String code,
      ReportType reportType,
      ReportFormat format,
      ReportSchedule schedule,
      ReportStatus status,
      long lastGeneratedHoursAgo) {
    Report report = new Report();
    report.setName(name);
    report.setCode(code);
    report.setReportType(reportType);
    report.setFormat(format);
    report.setSchedule(schedule);
    report.setStatus(status);
    Instant now = Instant.now();
    if (lastGeneratedHoursAgo >= 0) {
      report.setLastGeneratedAt(now.minus(lastGeneratedHoursAgo, ChronoUnit.HOURS));
    }
    report.setCreatedAt(now);
    report.setUpdatedAt(now);
    reportRepository.save(report);
  }
}

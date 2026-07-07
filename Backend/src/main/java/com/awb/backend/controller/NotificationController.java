package com.awb.backend.controller;

import com.awb.backend.notification.NotificationBroadcastService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

  private final NotificationBroadcastService notificationBroadcastService;

  public NotificationController(NotificationBroadcastService notificationBroadcastService) {
    this.notificationBroadcastService = notificationBroadcastService;
  }

  @GetMapping("/stream")
  public SseEmitter stream() {
    return notificationBroadcastService.subscribe();
  }
}

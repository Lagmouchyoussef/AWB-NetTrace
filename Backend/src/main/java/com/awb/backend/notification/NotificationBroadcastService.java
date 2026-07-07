package com.awb.backend.notification;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

// Fans every AuditLogWriter.log(...) call out to all connected browser tabs over
// Server-Sent Events. Single-instance broadcast (no per-user targeting) - every admin
// sees everything happening across the whole program, matching the shared audit trail.
@Service
public class NotificationBroadcastService {

  private static final long EMITTER_TIMEOUT_MS = 30L * 60 * 1000; // 30 min, browser reconnects after

  private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

  public SseEmitter subscribe() {
    SseEmitter emitter = new SseEmitter(EMITTER_TIMEOUT_MS);
    emitters.add(emitter);
    emitter.onCompletion(() -> emitters.remove(emitter));
    emitter.onTimeout(() -> emitters.remove(emitter));
    emitter.onError((ex) -> emitters.remove(emitter));
    return emitter;
  }

  public void broadcast(NotificationPayload payload) {
    for (SseEmitter emitter : emitters) {
      try {
        emitter.send(SseEmitter.event().name("notification").data(payload));
      } catch (IOException | IllegalStateException ex) {
        emitters.remove(emitter);
      }
    }
  }
}

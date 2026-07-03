package com.awb.backend.controller;

import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SecureController {

    @GetMapping("/api/secure/ping")
    public Map<String, String> ping(Authentication authentication) {
        return Map.of("message", "authenticated", "user", authentication.getName());
    }
}

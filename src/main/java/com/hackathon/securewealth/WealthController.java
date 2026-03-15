package com.hackathon.securewealth;

import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // Allows Vite React app to connect
@RequestMapping("/api/wealth")
public class WealthController {

    private final CyberProtectionService protectionService;

    public WealthController(CyberProtectionService protectionService) {
        this.protectionService = protectionService;
    }

    @PostMapping("/execute-action")
    public RiskDecision executeWealthAction(@RequestBody TransactionRequest request) {
        return protectionService.evaluateRisk(request);
    }
}
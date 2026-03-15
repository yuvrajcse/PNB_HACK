package com.hackathon.securewealth;

import org.springframework.stereotype.Service;

@Service
public class CyberProtectionService {

    private final String TRUSTED_DEVICE = "device_123";
    private final double AVERAGE_USUAL_AMOUNT = 15000.0;

    public RiskDecision evaluateRisk(TransactionRequest request) {
        int score = 0;
        StringBuilder reasons = new StringBuilder();

        if (!TRUSTED_DEVICE.equals(request.deviceId)) {
            score += 30;
            reasons.append("Unrecognized device. ");
        }
        if (request.timeSinceLoginSeconds < 10) {
            score += 20;
            reasons.append("Action taken unusually fast. ");
        }
        if (request.amount > (AVERAGE_USUAL_AMOUNT * 3)) {
            score += 40;
            reasons.append("Amount significantly higher than normal pattern. ");
        }
        if (request.otpRetries > 2) {
            score += 25;
            reasons.append("Multiple OTP attempts detected. ");
        }

        if (score < 30) {
            return new RiskDecision(score, "LOW", "ALLOW", "Action verified and safe.");
        } else if (score < 70) {
            return new RiskDecision(score, "MEDIUM", "WARN", "Review required: " + reasons.toString());
        } else {
            return new RiskDecision(score, "HIGH", "BLOCK", "Action blocked due to high risk: " + reasons.toString());
        }
    }
}
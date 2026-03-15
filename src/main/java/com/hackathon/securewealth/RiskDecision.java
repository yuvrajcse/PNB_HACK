package com.hackathon.securewealth;

public class RiskDecision {
    public int riskScore;
    public String riskLevel; // LOW, MEDIUM, HIGH
    public String action;    // ALLOW, WARN, BLOCK
    public String message;

    public RiskDecision(int riskScore, String riskLevel, String action, String message) {
        this.riskScore = riskScore;
        this.riskLevel = riskLevel;
        this.action = action;
        this.message = message;
    }
}
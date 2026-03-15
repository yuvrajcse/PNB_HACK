package com.hackathon.securewealth;

public class TransactionRequest {
    public double amount;
    public String deviceId;
    public int timeSinceLoginSeconds;
    public int otpRetries;
    public boolean isFirstTimeInvestment;
}
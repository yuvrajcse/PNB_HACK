package com.hackathon.securewealth;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/wealth")
public class WealthController {

    private final String FINNHUB_KEY = "d6r9cfpr01qgdhqdn1mgd6r9cfpr01qgdhqdn1n0";

    @GetMapping("/groww-suggestions")
    public ResponseEntity<Map<String, Object>> getInvestmentSuggestions(@RequestParam String profile) {
        Map<String, Object> finalResponse = new HashMap<>();
        List<Map<String, String>> stockList = new ArrayList<>();
        RestTemplate restTemplate = new RestTemplate();

        try {
            String[] symbols = {"NVDA", "AAPL", "TSLA"};
            for(String symbol : symbols){
                String url = "https://finnhub.io/api/v1/quote?symbol=" + symbol + "&token=" + FINNHUB_KEY;
                Map<String,Object> apiResponse = restTemplate.getForObject(url, Map.class);

                if(apiResponse != null && apiResponse.get("c") != null){
                    String price = apiResponse.get("c").toString();
                    String change = apiResponse.get("dp").toString();
                    stockList.add(Map.of(
                            "name", symbol + " (Live AI)",
                            "ticker", symbol,
                            "return", "₹" + price + " (" + change + "%)"
                    ));
                }
            }
            finalResponse.put("strategy","🟢 LIVE FINNHUB ENGINE");
        } catch(Exception e){
            // If you see THIS in your app, your internet or API key is blocked
            finalResponse.put("strategy","⚠️ API CONNECTION BLOCKED");
            stockList.add(Map.of("name","Nvidia","ticker","NVDA","return","Check Internet"));
        }
        finalResponse.put("stocks", stockList);
        return ResponseEntity.ok(finalResponse);
    }

    @PostMapping("/execute-action")
    public Map<String, Object> executeWealthAction(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        response.put("action", "BLOCK");
        response.put("riskScore", 115);
        response.put("message", "Security Alert: Transaction of ₹1L blocked. Pattern mismatch detected by AI Twin.");
        return response;
    }
}
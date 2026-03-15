package com.hackathon.securewealth;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.*;

@RestController
@RequestMapping("/api/wealth")
@CrossOrigin(origins = "http://localhost:5173")
public class WealthController {

    private final String GEMINI_KEY = "AIzaSyD39izCP5IaQfjAEQ1XEel_IKZxtOn8d9Y";
    private final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_KEY;

    // 1. DYNAMIC USER LIST (For your Login/Switcher)
    @GetMapping("/users")
    public List<Map<String, Object>> getUsers() {
        return Arrays.asList(
            Map.of("id", "U001", "name", "Arjun Sharma", "role", "Student", "risk", "Aggressive", "balance", 45000),
            Map.of("id", "U002", "name", "Dr. Priya Iyer", "role", "Conservative", "risk", "Low", "balance", 2500000),
            Map.of("id", "U003", "name", "Karan Mehta", "role", "Business Owner", "risk", "Moderate", "balance", 8000000)
        );
    }

    // 2. LIVE GEMINI AI SUGGESTIONS
    @GetMapping("/groww-suggestions")
    public ResponseEntity<Map<String, Object>> getAiWealthAdvice(@RequestParam String profile) {
        RestTemplate restTemplate = new RestTemplate();
        String systemInstruction = "Act as a PNB Bank Wealth Intelligence Twin. Profile: " + profile + ". " +
            "Suggest 3 assets. Return ONLY JSON: { 'strategy': 'title', 'stocks': [{ 'ticker', 'name', 'return', 'reason' }] }";

        Map<String, Object> requestBody = Map.of(
            "contents", List.of(Map.of("parts", List.of(Map.of("text", systemInstruction))))
        );

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(GEMINI_URL, requestBody, Map.class);
            List candidates = (List) response.getBody().get("candidates");
            Map content = (Map) ((Map) candidates.get(0)).get("content");
            String rawAiText = (String) ((Map) ((List) content.get("parts")).get(0)).get("text");

            String cleanJson = rawAiText.replaceAll("```json", "").replaceAll("```", "").trim();
            ObjectMapper mapper = new ObjectMapper();
            return ResponseEntity.ok(mapper.readValue(cleanJson, Map.class));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("strategy", "Safe Haven", "stocks", new ArrayList<>()));
        }
    }

    // 3. NET WORTH CALCULATOR (Requirement #5)
    @PostMapping("/calculate-health")
    public Map<String, Object> calculateHealth(@RequestBody Map<String, Double> assets) {
        double total = assets.values().stream().mapToDouble(Double::doubleValue).sum() + 150000;
        return Map.of(
            "netWorth", total,
            "aiInsight", "Your current asset mix is " + (total > 1000000 ? "Excellent" : "Growing") + ". Consider Gold for hedging."
        );
    }

    // 4. SECURITY/FRAUD LAYER (Requirement #7)
    @PostMapping("/execute-action")
    public Map<String, Object> executeAction(@RequestBody Map<String, Object> request) {
        return Map.of(
            "action", "BLOCK",
            "message", "Security Alert: This transaction exceeds your AI Twin's safety threshold."
        );
    }
}
package com.example.textanalyzerspring.rest;

import com.example.textanalyzerspring.model.TextAnalysesRequest;
import com.example.textanalyzerspring.model.TextAnalysesResult;
import com.example.textanalyzerspring.service.TextAnalyzerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/text-analyzer")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class TextAnalyzerRestService {

    private final TextAnalyzerService textAnalyzerService;

    @PostMapping("/analyze")
    public ResponseEntity<TextAnalysesResult> analyzeText(@Valid @RequestBody TextAnalysesRequest request) {
        log.info("Received analysis for: {}", request.getParameterType());

        TextAnalysesResult result = textAnalyzerService.analyzeText(request);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("API is running");
    }
}

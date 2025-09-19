package com.example.textanalyzerspring.model;

import lombok.*;

import java.time.Instant;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TextAnalysesResult {

    private ParameterType parameterType;
    private String originalText;
    private Map<Character, Integer> letterCounts;
    private Instant timestamp;

    public TextAnalysesResult(ParameterType parameterType, String originalText, Map<Character, Integer> letterCounts) {
        this.parameterType = parameterType;
        this.originalText = originalText;
        this.letterCounts = letterCounts;
        this.timestamp = Instant.now();
    }
}

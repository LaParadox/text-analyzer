package com.example.textanalyzerspring.service;

import com.example.textanalyzerspring.model.ParameterType;
import com.example.textanalyzerspring.model.TextAnalysesRequest;
import com.example.textanalyzerspring.model.TextAnalysesResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TextAnalyzerService {

    private static final Set<Character> VOWELS = Set.of('A', 'E', 'I', 'O', 'U');

    public TextAnalysesResult analyzeText(TextAnalysesRequest request) {
        // Validate request (will throw exception if invalid, caught by GlobalExceptionHandler)
        validateRequest(request);

        log.info("Analyzing text of length {} for {}",
                request.getInputText().length(), request.getParameterType());

        Map<Character, Integer> letterCounts = request.getParameterType() == ParameterType.VOWELS
                ? countVowels(request.getInputText())
                : countConsonants(request.getInputText());

        return new TextAnalysesResult(request.getParameterType(), request.getInputText(), letterCounts);
    }

    private void validateRequest(TextAnalysesRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }
        if (request.getParameterType() == null) {
            throw new IllegalArgumentException("Parameter Type cannot be null");
        }
        if (request.getInputText() == null) {
            throw new IllegalArgumentException("Text cannot be null");
        }
        if (request.getInputText().trim().isEmpty()) {
            throw new IllegalArgumentException("Text cannot be empty or whitespace only");
        }
    }

    private Map<Character, Integer> countVowels(String text) {
        Map<Character, Integer> counts = new LinkedHashMap<>();

        VOWELS.stream()
                .sorted()
                .forEach(vowel -> counts.put(vowel, 0));

        text.toUpperCase().chars()
                .mapToObj(c -> (char) c)
                .filter(VOWELS::contains)
                .forEach(vowel -> counts.merge(vowel, 1, Integer::sum));

        return counts;
    }

    private Map<Character, Integer> countConsonants(String text) {
        Map<Character, Integer> counts = text.toUpperCase().chars()
                .mapToObj(c -> (char) c)
                .filter(Character::isLetter)
                .filter(c -> !VOWELS.contains(c))
                .collect(Collectors.groupingBy(
                        c -> c,
                        Collectors.collectingAndThen(Collectors.counting(), Math::toIntExact)
                ));

        return counts.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (existing, replacement) -> existing,
                        LinkedHashMap::new
                ));
    }
}

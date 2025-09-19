package com.example.textanalyzerspring.service;

import com.example.textanalyzerspring.model.ParameterType;
import com.example.textanalyzerspring.model.TextAnalysesRequest;
import com.example.textanalyzerspring.model.TextAnalysesResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.assertj.core.api.Assertions.*;

@DisplayName("Text Analyzer Service Tests")
public class TextAnalyzerServiceTest {

    private TextAnalyzerService service;

    @BeforeEach
    void setUp() {
        service = new TextAnalyzerService();
    }

    @Test
    @DisplayName("Should count vowels")
    void shouldCountVowels() {
        var request = new TextAnalysesRequest(ParameterType.VOWELS, "Hello there");

        TextAnalysesResult result = service.analyzeText(request);

        assertThat(result.getParameterType()).isEqualTo(ParameterType.VOWELS);
        assertThat(result.getOriginalText()).isEqualTo("Hello there");
        assertThat(result.getTimestamp()).isNotNull();

        Map<Character, Integer> counts = result.getLetterCounts();
        assertThat(counts)
                .containsEntry('A', 0)
                .containsEntry('E', 3)
                .containsEntry('I', 0)
                .containsEntry('O', 1)
                .containsEntry('U', 0);
    }

    @Test
    @DisplayName("Should count consonants")
    void shouldCountConsonants() {
        var request = new TextAnalysesRequest(ParameterType.CONSONANTS, "Hello");

        TextAnalysesResult result = service.analyzeText(request);

        Map<Character, Integer> counts = result.getLetterCounts();
        assertThat(counts)
                .containsEntry('H', 1)
                .containsEntry('L', 2)
                .doesNotContainKey('E')
                .doesNotContainKey('O');
    }

    @Test
    @DisplayName("Should be case insensitive")
    void shouldBeCaseInsensitive() {
        var request = new TextAnalysesRequest(ParameterType.VOWELS, "SomeEth RaAndom");

        TextAnalysesResult result = service.analyzeText(request);

        Map<Character, Integer> counts = result.getLetterCounts();
        assertThat(counts)
                .containsEntry('A', 2)
                .containsEntry('E', 2)
                .containsEntry('I', 0);
    }

    @Test
    @DisplayName("Should ignore non-letters")
    void shouldIgnoreNonLetters() {
        var request = new TextAnalysesRequest(ParameterType.CONSONANTS, "XB2C!D@");

        TextAnalysesResult result = service.analyzeText(request);

        Map<Character, Integer> counts = result.getLetterCounts();
        assertThat(counts)
                .containsEntry('X', 1)
                .containsEntry('B', 1)
                .containsEntry('C', 1)
                .containsEntry('D', 1)
                .doesNotContainKey('2')
                .doesNotContainKey('!')
                .doesNotContainKey('@');
    }

    @Test
    @DisplayName("Should handle empty text with validation")
    void shouldThrowExceptionForEmptyText() {
        var request = new TextAnalysesRequest(ParameterType.VOWELS, "");

        assertThatThrownBy(() -> service.analyzeText(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Text cannot be empty or whitespace only");
    }

    @Test
    @DisplayName("Should throw exception for null")
    void shouldThrowExceptionForNull() {
        var request = new TextAnalysesRequest(ParameterType.VOWELS, null);

        assertThatThrownBy(() -> service.analyzeText(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Text cannot be null");
    }

    @Test
    @DisplayName("Should handle whitespace-only")
    void shouldThrowExceptionForWhitespaceOnly() {
        var request = new TextAnalysesRequest(ParameterType.VOWELS, "   \t\n  ");

        assertThatThrownBy(() -> service.analyzeText(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Text cannot be empty or whitespace only");
    }
}

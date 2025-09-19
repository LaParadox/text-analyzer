package com.example.textanalyzerspring.rest;

import com.example.textanalyzerspring.model.ParameterType;
import com.example.textanalyzerspring.model.TextAnalysesRequest;
import com.example.textanalyzerspring.model.TextAnalysesResult;
import com.example.textanalyzerspring.service.TextAnalyzerService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.assertj.core.api.Assertions.*;

import java.time.Instant;
import java.util.Map;

@ExtendWith(MockitoExtension.class)
@DisplayName("Text Analyzer Rest Service Tests")
public class TextAnalyzerRestServiceTest {

    @Mock
    private TextAnalyzerService textAnalyzerService;

    @InjectMocks
    private TextAnalyzerRestService textAnalyzerRestService;

    @Test
    @DisplayName("Should analyze text")
    void shouldAnalyzeText() {
        var request = new TextAnalysesRequest(ParameterType.VOWELS, "Hello");
        var expectedResult = new TextAnalysesResult(
                ParameterType.VOWELS,
                "Hello",
                Map.of('A', 0, 'E', 1, 'I', 0, 'O', 1, 'U', 0),
                Instant.now()
        );

        given(textAnalyzerService.analyzeText(any(TextAnalysesRequest.class)))
                .willReturn(expectedResult);

        ResponseEntity<TextAnalysesResult> response = textAnalyzerRestService.analyzeText(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getParameterType()).isEqualTo(ParameterType.VOWELS);
        assertThat(response.getBody().getOriginalText()).isEqualTo("Hello");
        assertThat(response.getBody().getLetterCounts()).containsEntry('E', 1);
    }

    @Test
    @DisplayName("Should let exceptions go to GlobalExceptionHandler")
    void shouldLetExceptionsGoToGlobalExceptionHandler() {
        var request = new TextAnalysesRequest(ParameterType.VOWELS, null);
        willThrow(new IllegalArgumentException("Text cannot be null"))
                .given(textAnalyzerService).analyzeText(any());

        assertThatThrownBy(() -> textAnalyzerRestService.analyzeText(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Text cannot be null");
    }

    @Test
    @DisplayName("Should return health status")
    void shouldReturnHealthStatus() {
        ResponseEntity<String> response = textAnalyzerRestService.health();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo("API is running");
    }
}

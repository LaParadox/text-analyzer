package com.example.textanalyzerspring.exception;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.BDDMockito.given;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@ExtendWith(MockitoExtension.class)
@DisplayName("Global Exception Handler Tests")
public class GlobalExceptionHandlerTest {

    @InjectMocks
    private GlobalExceptionHandler globalExceptionHandler;

    @Mock
    private MethodArgumentNotValidException methodArgumentNotValidException;

    @Mock
    private BindingResult bindingResult;

    @Test
    @DisplayName("Should handle MethodArgumentNotValidException with field errors")
    void shouldHandleMethodArgumentNotValidException() {
        FieldError fieldError1 = new FieldError("request", "parameterType", "Parameter type is required");
        FieldError fieldError2 = new FieldError("request", "inputText", "Text is required");

        given(methodArgumentNotValidException.getBindingResult()).willReturn(bindingResult);
        given(bindingResult.getAllErrors()).willReturn(Arrays.asList(fieldError1, fieldError2));

        ResponseEntity<Map<String, String>> response = globalExceptionHandler.handleValidationExceptions(methodArgumentNotValidException);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody())
                .containsEntry("parameterType", "Parameter type is required")
                .containsEntry("inputText", "Text is required")
                .hasSize(2);
    }

    @Test
    @DisplayName("Should handle MethodArgumentNotValidException with single field error")
    void shouldHandleMethodArgumentNotValidExceptionSingleError() {
        FieldError fieldError = new FieldError("request", "inputText", "Text cannot be empty");

        given(methodArgumentNotValidException.getBindingResult()).willReturn(bindingResult);
        given(bindingResult.getAllErrors()).willReturn(List.of(fieldError));

        ResponseEntity<Map<String, String>> response = globalExceptionHandler.handleValidationExceptions(methodArgumentNotValidException);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody())
                .containsEntry("inputText", "Text cannot be empty")
                .hasSize(1);
    }

    @Test
    @DisplayName("Should handle MethodArgumentNotValidException with no errors")
    void shouldHandleMethodArgumentNotValidExceptionNoErrors() {
        given(methodArgumentNotValidException.getBindingResult()).willReturn(bindingResult);
        given(bindingResult.getAllErrors()).willReturn(List.of());

        ResponseEntity<Map<String, String>> response = globalExceptionHandler.handleValidationExceptions(methodArgumentNotValidException);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).isEmpty();
    }

    @Test
    @DisplayName("Should handle IllegalArgumentException")
    void shouldHandleIllegalArgumentException() {
        IllegalArgumentException exception = new IllegalArgumentException("Text cannot be null");

        ResponseEntity<Map<String, String>> response = globalExceptionHandler.handleIllegalArgumentException(exception);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody())
                .containsEntry("error", "Invalid input")
                .containsEntry("message", "Text cannot be null")
                .hasSize(2);
    }

    @Test
    @DisplayName("Should handle IllegalArgumentException with empty message")
    void shouldHandleIllegalArgumentExceptionEmptyMessage() {
        IllegalArgumentException exception = new IllegalArgumentException("");

        ResponseEntity<Map<String, String>> response = globalExceptionHandler.handleIllegalArgumentException(exception);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody())
                .containsEntry("error", "Invalid input")
                .containsEntry("message", "")
                .hasSize(2);
    }

    @Test
    @DisplayName("Should handle IllegalArgumentException with null message")
    void shouldHandleIllegalArgumentExceptionNullMessage() {
        IllegalArgumentException exception = new IllegalArgumentException((String) null);

        ResponseEntity<Map<String, String>> response = globalExceptionHandler.handleIllegalArgumentException(exception);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody())
                .containsEntry("error", "Invalid input")
                .containsEntry("message", null)
                .hasSize(2);
    }

    @Test
    @DisplayName("Should handle NullPointerException as generic exception")
    void shouldHandleNullPointerException() {
        NullPointerException exception = new NullPointerException("Object reference is null");

        ResponseEntity<Map<String, String>> response = globalExceptionHandler.handleGenericException(exception);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody())
                .containsEntry("error", "Internal server error")
                .containsEntry("message", "Unexpected error occurred")
                .hasSize(2);
    }

    @Test
    @DisplayName("Should handle Exception with null message")
    void shouldHandleGenericExceptionNullMessage() {
        RuntimeException exception = new RuntimeException((String) null);

        ResponseEntity<Map<String, String>> response = globalExceptionHandler.handleGenericException(exception);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody())
                .containsEntry("error", "Internal server error")
                .containsEntry("message", "Unexpected error occurred")
                .hasSize(2);
    }
}

package com.example.textanalyzerspring.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TextAnalysesRequest {

    @NotNull
    private ParameterType parameterType;

    @NotBlank(message = "Text is required")
    private String inputText;
}

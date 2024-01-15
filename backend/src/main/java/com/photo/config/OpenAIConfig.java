package com.photo.config;

import jakarta.validation.constraints.NotEmpty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "spring.ai.openai")
public record OpenAIConfig(@NotEmpty String apiKey, @NotEmpty String imageGeneratorUrl) {
}

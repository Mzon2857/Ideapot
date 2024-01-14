package com.photo.service;

import com.photo.DTO.ImageDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.IOException;

@Service
public class DallEService {
    @Value("${spring.ai.openai.api-key}")
    private String OPEN_AI_KEY;

    private final WebClient webClient;

    @Autowired
    public DallEService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public Mono<String> generateDallEImage(String prompt) {
        String requestBody = String.format("""
            {
                "prompt": "%s",
                "n": 1,
                "size": "256x256",
                "response_format": "url"
            }
            """, prompt);

        String apiEndpoint = "https://api.openai.com/v1/images/generations";

        return webClient.post()
                .uri(apiEndpoint)
                .header("Authorization", "Bearer " + OPEN_AI_KEY)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(ImageGenerationResponse.class)
                .map(response -> response.getData()[0].getUrl());
    }

    private static class ImageGenerationResponse {
        private ImageGenerationResponseUrl[] data;

        public ImageGenerationResponseUrl[] getData() {
            return data;
        }
    }

    private static class ImageGenerationResponseUrl {
        private String url;

        public String getUrl() {
            return url;
        }
    }

}
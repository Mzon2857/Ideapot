package com.photo.service;

import com.photo.DTO.ImageDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URL;

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

    public Mono<String> generateDallEVariation(ImageDTO imageData) {
        String apiEndpoint = "https://api.openai.com/v1/images/variations";

        return downloadImage(imageData.getS3ImageUrl())
                .flatMap(imageBytes -> {
                    MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();
                    bodyBuilder.part("image", new ByteArrayResource(imageBytes) {
                        @Override
                        public String getFilename() {
                            return "image.png";
                        }
                    }, MediaType.IMAGE_PNG);
                    bodyBuilder.part("n", "1");
                    bodyBuilder.part("size", "256x256");
                    MultiValueMap<String, HttpEntity<?>> multipartData = bodyBuilder.build();
                    return webClient.post()
                            .uri(apiEndpoint)
                            .header("Authorization", "Bearer " + OPEN_AI_KEY)
                            .contentType(MediaType.MULTIPART_FORM_DATA)
                            .body(BodyInserters.fromMultipartData(multipartData))
                            .retrieve()
                            .bodyToMono(String.class);
                });
    }

    private Mono<byte[]> downloadImage(String imageUrl) {
        return Mono.fromCallable(() -> {
            try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                ImageIO.write(ImageIO.read(new URL(imageUrl)), "png", baos);
                return baos.toByteArray();
            } catch (IOException e) {
                throw new RuntimeException("Error downloading image", e);
            }
        }).subscribeOn(Schedulers.boundedElastic());
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
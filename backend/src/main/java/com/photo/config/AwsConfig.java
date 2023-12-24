package com.photo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class AwsConfig {

    @Value("${aws.accessKey}")
    private String awsAccessKey;

    @Value("${aws.secretKey}")
    private String awsSecretKey;

    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
                .region(Region.US_EAST_2)
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(awsAccessKey, awsSecretKey)))
                .build();
    }
}

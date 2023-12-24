package com.photo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String username;
    private String s3ImageUrl;

    // Getters and setters
    public void setS3ImageUrl(String fileUrl) {
        this.s3ImageUrl = s3ImageUrl;
    }

    public String getS3ImageUrl() {
        return s3ImageUrl;
    }
}

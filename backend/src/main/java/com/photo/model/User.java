package com.photo.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@Document("users")
public class User {

    @Id
    private String id;

    private String username;
    private String s3ImageUrl;
    public User(String id, String username, String s3ImageUrl) {
        super();
        this.id = id;
        this.username = username;
        this.s3ImageUrl = s3ImageUrl;
    }
}

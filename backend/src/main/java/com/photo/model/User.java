package com.photo.model;

import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.*;
import org.springframework.data.annotation.Id;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {

    @jakarta.persistence.Id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String profileS3ImageUrl;

    @ElementCollection
    @CollectionTable(name = "user_s3_image_urls", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "s3_image_url")
    private List<String> s3ImageUrls = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images = new ArrayList<>();

    public User() {
    }

    public User(Long id, String username, String s3ImageUrl) {
        this.username = username;
        this.profileS3ImageUrl = s3ImageUrl;
        this.id = id;
    }
}

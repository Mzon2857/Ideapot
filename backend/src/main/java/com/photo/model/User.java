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

    @Column(name = "given_name")
    private String givenName;

    private String nickname;

    @Column(name = "full_name")
    private String name;

    private String email;

    @Column(name = "email_verified")
    private boolean emailVerified;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    
    @ElementCollection
    @CollectionTable(name = "user_s3_image_urls", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "s3_image_url")
    private List<String> s3ImageUrls = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images = new ArrayList<>();

    public User() {
    }

    public User(Long id, String givenName, String profilePictureUrl) {
        this.id = id;
        this.givenName = givenName;
        this.profilePictureUrl = profilePictureUrl;
    }
}

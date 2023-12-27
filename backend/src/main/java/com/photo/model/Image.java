package com.photo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

@Getter
@Setter
@Entity
@Table(name = "images")
public class Image {
    @jakarta.persistence.Id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String s3ImageUrl;
    private String description;
    private String title;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}

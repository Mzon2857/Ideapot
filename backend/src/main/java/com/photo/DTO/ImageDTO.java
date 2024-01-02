package com.photo.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ImageDTO {
    private Long id;
    private String s3ImageUrl;
    private String title;
    private String description;
}

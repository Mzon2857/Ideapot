package com.photo.service;

import com.photo.model.Image;
import com.photo.model.User;
import com.photo.repository.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ImageService {

    private final ImageRepository imageRepository;

    private final S3Service s3Service;

    @Autowired
    public ImageService(ImageRepository imageRepository, S3Service s3Service) {
        this.imageRepository = imageRepository;
        this.s3Service = s3Service;
    }

    public void createImage(Long userId, MultipartFile file, String title, String description) throws IOException {
        String s3Key = "user-images/" + userId + "/" + file.getOriginalFilename();
        s3Service.uploadFile(s3Key, file);
        String s3Url = s3Service.getFileUrl(s3Key);

        User user = new User();
        user.setId(userId);

        Image image = new Image();
        image.setS3ImageUrl(s3Url);
        image.setUser(user);
        image.setTitle(title);
        image.setDescription(description);

        imageRepository.save(image);
    }

    public List<String> getImageUrlByUserId(Long userId) {
        return imageRepository.findImageUrlByUserId(userId);
    }
}
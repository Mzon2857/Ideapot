package com.photo.controller;

import com.photo.model.User;
import com.photo.respository.UserRepository;
import com.photo.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private S3Service s3Service;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/{userId}/upload-image")
    public String uploadImage(@PathVariable String userId, @RequestParam("file") MultipartFile file) throws IOException {
        // Save file to AWS S3
        File convertedFile = File.createTempFile("temp", null);
        file.transferTo(convertedFile);

        String s3Key = "user-images/" + userId + "/" + file.getOriginalFilename();
        String eTag = s3Service.uploadFile(s3Key, convertedFile);

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setS3ImageUrl(s3Service.getFileUrl(s3Key));
        userRepository.save(user);

        return "Image uploaded successfully. ETag: " + eTag;
    }

    @GetMapping("/{userId}/get-image-url")
    public String getImageUrl(@PathVariable String userId) {
        // Retrieve S3 URL from MongoDB
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getS3ImageUrl();
    }
}

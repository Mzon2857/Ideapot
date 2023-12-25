package com.photo.controller;

import com.photo.model.User;
import com.photo.service.S3Service;
import com.photo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private S3Service s3Service;

    @PostMapping(value = "/create")
    @ResponseStatus(HttpStatus.CREATED)
    public String createUser(@RequestBody User newUser) {
        User createdUser = userService.createUser(newUser);
        return "User created successfully with ID: " + createdUser.getId();
    }

    @PostMapping("/{userId}/upload-image")
    public String uploadImage(@PathVariable String userId, @RequestParam("file") MultipartFile file) throws IOException {
        // Save file to AWS S3
        String s3Key = "user-images/" + userId + "/" + file.getOriginalFilename();
        String eTag = s3Service.uploadFile(s3Key, file);

        User user = userService.getUserById(userId);
        user.getS3ImageUrls().add(s3Service.getFileUrl(s3Key));
        userService.updateUser(user);

        return "Image uploaded successfully. ETag: " + eTag;
    }

    @GetMapping("/{userId}/get-image-url")
    public String getImageUrl(@PathVariable String userId) {
        // Retrieve S3 URL from MongoDB
        User user = userService.getUserById(userId);
        return user.getS3ImageUrl();
    }
}

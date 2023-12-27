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

    @PostMapping(value = "/create")
    @ResponseStatus(HttpStatus.CREATED)
    public String createUser(@RequestBody User newUser) {
        User createdUser = userService.createUser(newUser);
        return "User created successfully with ID: " + createdUser.getId();
    }
}

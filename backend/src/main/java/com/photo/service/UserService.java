package com.photo.service;

import com.photo.model.Image;
import com.photo.model.User;
import com.photo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User newUser) {
        return userRepository.save(newUser);
    }


    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public List<Image> getImagesByUserId(Long userId) {
        return userRepository.findImagesByUserId(userId);
    }
}
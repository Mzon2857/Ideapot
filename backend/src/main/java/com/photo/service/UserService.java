package com.photo.service;

import com.photo.model.Image;
import com.photo.model.User;
import com.photo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User newUser) {
        Optional<User> existingUser = userRepository.findByEmail(newUser.getEmail());
        if (existingUser.isPresent()) {
            return existingUser.get();
        } else {
            return userRepository.save(newUser);
        }
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public List<Image> getImagesByUserId(Long userId) {
        return userRepository.findImagesByUserId(userId);
    }
}
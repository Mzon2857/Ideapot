package com.photo.service;

import com.photo.DTO.UserDTO;
import com.photo.model.Image;
import com.photo.model.User;
import com.photo.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
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

    public UserDTO getUserInfoById(Long id) {
        return userRepository.findById(id)
                .map(user -> UserDTO.builder()
                        .username(user.getNickname())
                        .picture(user.getPicture())
                        .build())
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public List<Image> getImagesByUserId(Long userId) {
        return userRepository.findImagesByUserId(userId);
    }
}
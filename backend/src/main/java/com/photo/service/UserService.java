package com.photo.service;

import com.photo.DTO.UserDTO;
import com.photo.model.Image;
import com.photo.model.User;
import com.photo.repository.UserRepository;
import com.photo.utils.SecurityUtils;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
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

    public User getUserByNickname(String nickname){
        return userRepository.findByNickname(nickname)
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

    public User findUserByAuth0Sub(String sub) {
        return userRepository.findBySub(sub)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with sub: " + sub));
    }

    public void validateUser(Long expectedUserId) throws AccessDeniedException {
        String currentAuth0Sub = SecurityUtils.getCurrentUserId();
        User user = findUserByAuth0Sub(currentAuth0Sub);

        if (!user.getId().equals(expectedUserId)) {
            throw new AccessDeniedException("User does not have permission to perform this operation.");
        }
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public List<Image> getImagesByUserId(Long userId) {
        return userRepository.findImagesByUserId(userId);
    }
}
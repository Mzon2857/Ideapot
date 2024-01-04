package com.photo.service;

import com.photo.DTO.ImageDTO;
import com.photo.model.Image;
import com.photo.model.User;
import com.photo.repository.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ImageService {

    private final ImageRepository imageRepository;
    private final UserService userService;
    private final S3Service s3Service;

    @Autowired
    public ImageService(ImageRepository imageRepository, S3Service s3Service, UserService userService) {
        this.imageRepository = imageRepository;
        this.s3Service = s3Service;
        this.userService = userService;
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

    public List<ImageDTO> getImagesByUserId(Long userId) {
        List<Image> images = imageRepository.findImagesByUserId(userId);
        return images.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public ImageDTO getImageById(Long imageId) {
        Image image = imageRepository.findImageById(imageId);
        return convertToDto(image);
    }

    public List<ImageDTO> getFeed() {
        int limit = 50;
        List<Image> images = imageRepository.findImagesWithLimit(limit);
        return images.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private ImageDTO convertToDto(Image image) {
        ImageDTO dto = new ImageDTO();
        dto.setId(image.getId());
        dto.setS3ImageUrl(image.getS3ImageUrl());
        dto.setTitle(image.getTitle());
        dto.setDescription(image.getDescription());
        dto.setPosterInfo(userService.getUserInfoById(image.getUser().getId()));
        return dto;
    }
}
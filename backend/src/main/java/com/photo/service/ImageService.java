package com.photo.service;

import com.photo.DTO.CommentDTO;
import com.photo.DTO.ImageDTO;
import com.photo.DTO.UserDTO;
import com.photo.model.Comment;
import com.photo.model.Image;
import com.photo.model.Like;
import com.photo.model.User;
import com.photo.repository.CommentRepository;
import com.photo.repository.ImageRepository;
import com.photo.repository.LikeRepository;
import com.photo.repository.UserRepository;
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
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final S3Service s3Service;

    @Autowired
    public ImageService(ImageRepository imageRepository, CommentRepository commentRepository, S3Service s3Service, UserService userService, UserRepository userRepository, LikeRepository likeRepository) {
        this.imageRepository = imageRepository;
        this.s3Service = s3Service;
        this.userService = userService;
        this.userRepository = userRepository;
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
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

    public ImageDTO getImageById(Long imageId, Long userId) {
        Image image = imageRepository.findById(imageId).orElseThrow();
        ImageDTO dto = convertToDto(image);
        dto.setUserLiked(likeRepository.existsByUserIdAndImageId(userId, imageId));
        return dto;
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
        dto.setLikes(image.getLikesCount());
        dto.setPosterInfo(userService.getUserInfoById(image.getUser().getId()));
        return dto;
    }

    public void likeImage(Long userId, Long imageId) {
        User user = userRepository.findById(userId).orElseThrow();
        Image image = imageRepository.findById(imageId).orElseThrow();

        image.setLikesCount(image.getLikesCount() + 1);
        imageRepository.save(image);

        Like like = new Like();
        like.setUser(user);
        like.setImage(image);

        likeRepository.save(like);
    }

    public void unlikeImage(Long userId, Long imageId){
        Image image = imageRepository.findById(imageId).orElseThrow();

        image.setLikesCount(image.getLikesCount() - 1);
        imageRepository.save(image);

        likeRepository.findByUserIdAndImageId(userId, imageId)
                .ifPresent(likeRepository::delete);
    }

    public Boolean hasUserLikedImage(Long imageId, Long userId){
        return likeRepository.existsByUserIdAndImageId(userId, imageId);
    }

    public void addCommentToImage(CommentDTO commentDTO, Long imageId) {
        Long userId = commentDTO.getUser().getId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setImage(image);
        comment.setText(commentDTO.getText());

        commentRepository.save(comment);
    }


    public List<CommentDTO> getCommentsByImageId(Long imageId) {
        List<Comment> comments = commentRepository.findByImageId(imageId);
        return comments.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        commentRepository.delete(comment);
    }

    private CommentDTO convertToDto(Comment comment) {
        UserDTO userDTO = UserDTO.builder()
                .id(comment.getUser().getId())
                .username(comment.getUser().getNickname())
                .picture(comment.getUser().getPicture())
                .build();

        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setUser(userDTO);
        dto.setText(comment.getText());
        return dto;
    }
}
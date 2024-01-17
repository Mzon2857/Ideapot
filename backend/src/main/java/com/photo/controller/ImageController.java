package com.photo.controller;

import com.photo.DTO.CommentDTO;
import com.photo.DTO.ImageDTO;
import com.photo.DTO.LikeDTO;
import com.photo.model.Image;
import com.photo.service.DallEService;
import com.photo.service.ImageService;
import com.photo.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/private/images")
public class ImageController {

    private final ImageService imageService;
    private final S3Service s3Service;
    private final DallEService dallEService;

    @Autowired
    public ImageController(ImageService imageService, S3Service s3Service, DallEService dallEService) {
        this.imageService = imageService;
        this.s3Service = s3Service;
        this.dallEService = dallEService;
    }


    @PostMapping("/{userId}/upload")
    @ResponseStatus(HttpStatus.CREATED)
    public String uploadImage(@PathVariable Long userId,
                              @RequestParam(value = "file", required = false) MultipartFile file,
                              @RequestParam("title") String title,
                              @RequestParam("description") String description,
                              @RequestParam(value = "dallEUrl", required = false) String dallEUrl) throws IOException {
        imageService.createImage(userId, file, title, description, dallEUrl);
        return "Image uploaded successfully.";
    }

    @GetMapping("/{userId}/get-url")
    public List<String> getImageUrl(@PathVariable Long userId) {
        return imageService.getImageUrlByUserId(userId);
    }

    @GetMapping("/{userId}/get-images")
    public List<ImageDTO> getImages(@PathVariable Long userId){
        return imageService.getImagesByUserId(userId);
    }

    @GetMapping("/get-feed")
    public List<ImageDTO> getFeed(){
        return imageService.getFeed();
    }

    @GetMapping("/get-image/{imageId}")
    public ImageDTO getImage(@PathVariable Long imageId, @RequestParam Long userId){
        return imageService.getImageById(imageId, userId);
    }


    //Likes
    @PostMapping("/{imageId}/like")
    public ResponseEntity<?> likeImage(@RequestBody LikeDTO likeRequest) {
        imageService.likeImage(likeRequest.getUserId(), likeRequest.getImageId());
        return ResponseEntity.ok("Image liked successfully");
    }

    @PostMapping("/{imageId}/unlike")
    public ResponseEntity<?> unlikeImage(@RequestBody LikeDTO likeRequest) {
        imageService.unlikeImage(likeRequest.getUserId(), likeRequest.getImageId());
        return ResponseEntity.ok("Image unliked successfully");
    }

    @GetMapping("/{imageId}/hasLiked")
    public Boolean hasUserLikedImage(@PathVariable Long imageId, @RequestParam Long userId) {
        return imageService.hasUserLikedImage(imageId, userId);
    }


    //handling Comments
    @PostMapping("/{imageId}/comment")
    public ResponseEntity<?> addComment(@PathVariable Long imageId,
                                        @RequestBody CommentDTO commentRequest) {
        imageService.addCommentToImage(commentRequest, imageId);
        return ResponseEntity.ok("Comment added successfully");
    }


    @GetMapping("/{imageId}/comments")
    public List<CommentDTO> getComments(@PathVariable Long imageId) {
        return imageService.getCommentsByImageId(imageId);
    }

    @DeleteMapping("/delete-comment/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        imageService.deleteComment(commentId);
        return ResponseEntity.ok("Comment deleted successfully");
    }


    //dallE generation
    @PostMapping("/generate-dalle-image")
    public Mono<ResponseEntity<String>> generateDalleImage(@RequestParam String prompt) {
        return dallEService.generateDallEImage(prompt)
                .map(url -> ResponseEntity.ok().body(url))
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error generating image: " + e.getMessage())));
    }
}

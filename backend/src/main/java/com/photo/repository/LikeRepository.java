package com.photo.repository;

import com.photo.model.Like;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserIdAndImageId(Long userId, Long imageId);
    boolean existsByUserIdAndImageId(Long userId, Long imageId);

}

package com.photo.repository;

import com.photo.model.Image;
import com.photo.model.User;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByNickname(String nickname);

    Optional<User> findById(Long id);
    @Query("SELECT i FROM Image i WHERE i.user.id = :userId")
    List<Image> findImagesByUserId(Long userId);
}

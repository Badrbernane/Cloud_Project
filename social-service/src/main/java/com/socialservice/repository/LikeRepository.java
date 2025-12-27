package com.socialservice.repository;

import com.socialservice.model.Like;
import com.socialservice.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype. Repository;

import java.util.List;
import java.util. Optional;
import java.util.UUID;

@Repository
public interface LikeRepository extends JpaRepository<Like, UUID> {

    Optional<Like> findByPostAndUserId(Post post, UUID userId);

    boolean existsByPostAndUserId(Post post, UUID userId);

    long countByPost(Post post);

    List<Like> findByPost(Post post);
}
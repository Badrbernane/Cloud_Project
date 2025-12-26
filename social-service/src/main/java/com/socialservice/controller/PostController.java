package com.socialservice.controller;

import com.socialservice.dto. CommentResponse;
import com. socialservice.dto.CreateCommentRequest;
import com.socialservice.dto.CreatePostRequest;
import com.socialservice.dto. PostResponse;
import com.socialservice.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern. slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")  // ← AJOUTE LE SLASH !
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class PostController {

    private final PostService postService;

    // ✅ AJOUTE CETTE MÉTHODE
    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts(
            @RequestParam(required = false) UUID currentUserId) {
        log.info("GET /api/posts - Getting all posts");
        List<PostResponse> posts = postService.getAllPosts(currentUserId);
        return ResponseEntity.ok(posts);
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(@Valid @RequestBody CreatePostRequest request) {
        log.info("POST /posts - Creating post");
        PostResponse response = postService.createPost(request);
        return ResponseEntity. status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/feed")
    public ResponseEntity<Page<PostResponse>> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) UUID currentUserId) {
        log.info("GET /posts/feed - page: {}, size: {}", page, size);
        Page<PostResponse> feed = postService.getFeed(page, size, currentUserId);
        return ResponseEntity. ok(feed);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> getPost(
            @PathVariable UUID postId,
            @RequestParam(required = false) UUID currentUserId) {
        log.info("GET /posts/{}", postId);
        PostResponse response = postService.getPostById(postId, currentUserId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<PostResponse> likePost(
            @PathVariable UUID postId,
            @RequestParam UUID userId) {
        log.info("POST /posts/{}/like", postId);
        PostResponse response = postService.likePost(postId, userId);
        return ResponseEntity. ok(response);
    }

    @PostMapping("/{postId}/unlike")  // ← CHANGE EN POST au lieu de DELETE
    public ResponseEntity<PostResponse> unlikePost(
            @PathVariable UUID postId,
            @RequestParam UUID userId) {
        log.info("POST /posts/{}/unlike", postId);
        PostResponse response = postService.unlikePost(postId, userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable UUID postId,
            @Valid @RequestBody CreateCommentRequest request) {
        log.info("POST /posts/{}/comments", postId);
        CommentResponse response = postService.addComment(postId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Social Service is UP and running!  ✅");
    }
}
package com.socialservice.service;

import com.socialservice.dto.CommentResponse;
import com.socialservice. dto.CreateCommentRequest;
import com.socialservice.dto. CreatePostRequest;
import com.socialservice.dto.PostResponse;
import com.socialservice.model.Comment;
import com.socialservice. model.Like;
import com.socialservice. model.Post;
import com. socialservice.repository.CommentRepository;
import com.socialservice. repository.LikeRepository;
import com.socialservice.repository. PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework. data.domain.Pageable;
import org.springframework.data. domain.Sort;
import org. springframework.stereotype.Service;
import org.springframework.transaction.annotation. Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream. Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {

    private final PostRepository postRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;

    @Transactional
    public PostResponse createPost(CreatePostRequest request) {
        log.info("Creating post for user:  {}", request.getUserId());

        Post post = Post.builder()
                .userId(request.getUserId())
                .content(request.getContent())
                .imageUrl(request.getImageUrl())
                .likesCount(0)
                .commentsCount(0)
                .build();

        Post savedPost = postRepository.save(post);
        log.info("Post created with id: {}", savedPost.getId());

        return mapToResponse(savedPost, null);
    }

    // ✅ GET ALL POSTS
    @Transactional(readOnly = true)
    public List<PostResponse> getAllPosts(UUID currentUserId) {
        log.info("📋 Getting all posts");

        List<Post> posts = postRepository. findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

        return posts.stream()
                .map(post -> mapToResponse(post, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<PostResponse> getFeed(int page, int size, UUID currentUserId) {
        log.info("Fetching feed - page: {}, size: {}", page, size);

        Pageable pageable = PageRequest. of(page, size);
        Page<Post> posts = postRepository. findAllByOrderByCreatedAtDesc(pageable);

        return posts.map(post -> mapToResponse(post, currentUserId));
    }

    @Transactional(readOnly = true)
    public PostResponse getPostById(UUID postId, UUID currentUserId) {
        log.info("Fetching post:  {}", postId);

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        return mapToResponseWithComments(post, currentUserId);
    }

    @Transactional
    public PostResponse likePost(UUID postId, UUID userId) {
        log.info("User {} liking post {}", userId, postId);

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (likeRepository.existsByPostAndUserId(post, userId)) {
            throw new RuntimeException("Post already liked by user");
        }

        Like like = Like.builder()
                .post(post)
                .userId(userId)
                .build();

        likeRepository.save(like);

        post.setLikesCount(post.getLikesCount() + 1);
        postRepository.save(post);

        log.info("Post {} liked successfully", postId);
        return mapToResponse(post, userId);
    }

    @Transactional
    public PostResponse unlikePost(UUID postId, UUID userId) {
        log.info("User {} unliking post {}", userId, postId);

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Like like = likeRepository.findByPostAndUserId(post, userId)
                .orElseThrow(() -> new RuntimeException("Like not found"));

        likeRepository.delete(like);

        post.setLikesCount(Math.max(0, post. getLikesCount() - 1));
        postRepository.save(post);

        log.info("Post {} unliked successfully", postId);
        return mapToResponse(post, userId);
    }

    @Transactional
    public CommentResponse addComment(UUID postId, CreateCommentRequest request) {
        log.info("Adding comment to post {} by user {}", postId, request.getUserId());

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = Comment.builder()
                .post(post)
                .userId(request.getUserId())
                .content(request. getContent())
                .build();

        Comment savedComment = commentRepository.save(comment);

        post.setCommentsCount(post. getCommentsCount() + 1);
        postRepository.save(post);

        log.info("Comment added successfully");
        return mapCommentToResponse(savedComment);
    }

    // MAPPERS
    private PostResponse mapToResponse(Post post, UUID currentUserId) {
        boolean liked = currentUserId != null &&
                likeRepository.existsByPostAndUserId(post, currentUserId);

        return PostResponse.builder()
                .id(post.getId())
                .userId(post.getUserId())
                .content(post.getContent())
                .imageUrl(post.getImageUrl())
                .likesCount(post.getLikesCount())
                .commentsCount(post.getCommentsCount())
                .createdAt(post.getCreatedAt())
                .updatedAt(post. getUpdatedAt())
                .likedByCurrentUser(liked)
                .build();
    }

    private PostResponse mapToResponseWithComments(Post post, UUID currentUserId) {
        PostResponse response = mapToResponse(post, currentUserId);

        List<CommentResponse> comments = commentRepository.findByPostOrderByCreatedAtDesc(post)
                .stream()
                .map(this::mapCommentToResponse)
                .collect(Collectors. toList());

        response.setComments(comments);
        return response;
    }

    private CommentResponse mapCommentToResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .userId(comment.getUserId())
                .content(comment. getContent())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
package com.marketplace.service;

import com.marketplace.dto.ProductImageResponse;
import com.marketplace.entity.Product;
import com.marketplace.entity.ProductImage;
import com.marketplace.repository.ProductImageRepository;
import com.marketplace.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class ImageService {

    private static final Path UPLOAD_ROOT = Paths.get("uploads").toAbsolutePath().normalize();

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    public ImageService(ProductRepository productRepository, ProductImageRepository productImageRepository) {
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
    }

    public ProductImageResponse uploadProductImage(Long productId, Long sellerId, MultipartFile file) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        if (!Objects.equals(product.getSellerId(), sellerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only seller can upload images");
        }

        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase().startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File must be an image");
        }

        try {
            Files.createDirectories(UPLOAD_ROOT);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Cannot create upload directory", e);
        }

        String extension = "";
        String originalName = file.getOriginalFilename();
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }
        String filename = UUID.randomUUID() + extension;
        Path target = UPLOAD_ROOT.resolve(filename).normalize();

        try {
            file.transferTo(target.toFile());
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Cannot save file", e);
        }

        ProductImage entity = ProductImage.builder()
                .product(product)
                .url("/uploads/" + filename)
                .createdAt(Instant.now())
                .build();

        ProductImage saved = productImageRepository.save(entity);
        product.getImages().add(saved);

        return toDto(saved);
    }

    public List<ProductImageResponse> getImages(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        }
        return productImageRepository.findByProductId(productId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    private ProductImageResponse toDto(ProductImage image) {
        return ProductImageResponse.builder()
                .id(image.getId())
                .url(image.getUrl())
                .createdAt(image.getCreatedAt())
                .build();
    }
}

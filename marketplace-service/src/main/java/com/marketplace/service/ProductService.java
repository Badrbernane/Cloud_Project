package com.marketplace.service;

import com.marketplace.client.UserClient;
import com.marketplace.dto.ProductRequest;
import com.marketplace.dto.ProductResponse;
import com.marketplace.dto.ProductUpdateRequest;
import com.marketplace.entity.Category;
import com.marketplace.entity.Product;
import com.marketplace.entity.ProductImage;
import com.marketplace.entity.ProductStatus;
import com.marketplace.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
public class ProductService {

    private static final String DEFAULT_CURRENCY = "MAD";

    private final ProductRepository productRepository;
    private final UserClient userClient;

    public ProductService(ProductRepository productRepository, UserClient userClient) {
        this.productRepository = productRepository;
        this.userClient = userClient;
    }

    public ProductResponse create(ProductRequest req) {
        ensureUserExists(req.getSellerId());
        Product saved = productRepository.save(toEntity(req));
        return toDto(saved);
    }

    public List<ProductResponse> list(Optional<String> status, Optional<String> category, Optional<String> city, Optional<String> q) {
        Optional<ProductStatus> statusFilter = status.map(this::parseStatus);
        Optional<Category> categoryFilter = category.map(this::parseCategory);
        List<Product> list = productRepository.findAll();
        return list.stream()
            .filter(p -> statusFilter.map(s -> p.getStatus() == s).orElse(true))
            .filter(p -> categoryFilter.map(c -> p.getCategory() == c).orElse(true))
            .filter(p -> city.map(value -> p.getCity() != null && p.getCity().equalsIgnoreCase(value)).orElse(true))
            .filter(p -> q.map(term -> matchesQuery(p, term)).orElse(true))
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public ProductResponse getById(Long id) {
        Product p = productRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        return toDto(p);
    }

    public List<ProductResponse> getBySeller(UUID sellerId) {
        return productRepository.findBySellerId(sellerId).stream().map(this::toDto).collect(Collectors.toList());
    }

    public ProductResponse update(Long id, UUID sellerId, ProductUpdateRequest req) {
        Product p = productRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        if (!Objects.equals(p.getSellerId(), sellerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only seller can modify the product");
        }
        ensureUserExists(sellerId);
        p.setTitle(req.getTitle());
        p.setDescription(req.getDescription());
        p.setPrice(req.getPrice());
        p.setCity(req.getCity());
        p.setCategory(req.getCategory());
        p.setPhoneNumber(req.getPhoneNumber());
        if (req.getCurrency() != null && !req.getCurrency().isBlank()) {
            p.setCurrency(resolveCurrency(req.getCurrency()));
        }
        productRepository.save(p);
        return toDto(p);
    }

    public void delete(Long id, UUID sellerId) {
        Product p = productRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        if (!Objects.equals(p.getSellerId(), sellerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only seller can delete the product");
        }
        ensureUserExists(sellerId);
        productRepository.delete(p);
    }

    /* package */ Product toEntity(ProductRequest req) {
        return Product.builder()
                .sellerId(req.getSellerId())
                .title(req.getTitle())
                .description(req.getDescription())
                .price(req.getPrice())
                .currency(resolveCurrency(req.getCurrency()))
                .category(req.getCategory())
                .city(req.getCity())
                .phoneNumber(req.getPhoneNumber())
                .status(ProductStatus.AVAILABLE)
                .build();
    }

    private ProductResponse toDto(Product p) {
        List<String> imageUrls = p.getImages() == null ? List.of() :
                p.getImages().stream().map(ProductImage::getUrl).toList();
        return ProductResponse.builder()
                .id(p.getId())
                .sellerId(p.getSellerId())
                .title(p.getTitle())
                .description(p.getDescription())
                .price(p.getPrice())
                .currency(p.getCurrency())
                .phoneNumber(p.getPhoneNumber())
                .category(p.getCategory())
                .city(p.getCity())
                .status(p.getStatus())
                .createdAt(p.getCreatedAt())
                .imageUrls(imageUrls)
                .build();
    }

    private String resolveCurrency(String currency) {
        if (currency == null || currency.isBlank()) {
            return DEFAULT_CURRENCY;
        }
        return currency.trim().toUpperCase();
    }

    private boolean matchesQuery(Product p, String term) {
        String lowerTerm = term.toLowerCase(Locale.ROOT);
        return (p.getTitle() != null && p.getTitle().toLowerCase(Locale.ROOT).contains(lowerTerm))
                || (p.getDescription() != null && p.getDescription().toLowerCase(Locale.ROOT).contains(lowerTerm));
    }

    private ProductStatus parseStatus(String value) {
        try {
            return ProductStatus.valueOf(value.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid product status: " + value);
        }
    }

    private Category parseCategory(String value) {
        try {
            return Category.valueOf(value.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid category: " + value);
        }
    }

    private void ensureUserExists(UUID userId) {
        try {
            userClient.getUser(userId.toString());
        } catch (feign.FeignException.NotFound e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + userId);
        } catch (feign.FeignException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "User service unavailable");
        }
    }
}

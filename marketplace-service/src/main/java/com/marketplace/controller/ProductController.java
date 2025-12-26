package com.marketplace.controller;

import com.marketplace.dto.ProductImageResponse;
import com.marketplace.dto.ProductRequest;
import com.marketplace.dto.ProductResponse;
import com.marketplace.dto.ProductUpdateRequest;
import com.marketplace.service.ImageService;
import com.marketplace.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/market/products")
public class ProductController {

    private final ProductService productService;
    private final ImageService imageService;

    public ProductController(ProductService productService, ImageService imageService) {
        this.productService = productService;
        this.imageService = imageService;
    }

    @PostMapping
    public ProductResponse create(@Valid @RequestBody ProductRequest req) {
        return productService.create(req);
    }

    @GetMapping
    public List<ProductResponse> list(@RequestParam Optional<String> status,
                                     @RequestParam Optional<String> category,
                                     @RequestParam Optional<String> city,
                                     @RequestParam(name = "q") Optional<String> q) {
        return productService.list(status, category, city, q);
    }

    @GetMapping("/{id}")
    public ProductResponse get(@PathVariable Long id) {
        return productService.getById(id);
    }

    @GetMapping("/seller/{sellerId}")
    public List<ProductResponse> bySeller(@PathVariable Long sellerId) {
        return productService.getBySeller(sellerId);
    }

    @PutMapping("/{id}")
    public ProductResponse update(@PathVariable Long id, @RequestParam Long sellerId, @Valid @RequestBody ProductUpdateRequest req) {
        return productService.update(id, sellerId, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, @RequestParam Long sellerId) {
        productService.delete(id, sellerId);
    }

    @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductImageResponse uploadImage(@PathVariable Long id, @RequestParam Long sellerId, @RequestPart("file") MultipartFile file) {
        return imageService.uploadProductImage(id, sellerId, file);
    }

    @GetMapping("/{id}/images")
    public List<ProductImageResponse> listImages(@PathVariable Long id) {
        return imageService.getImages(id);
    }
}

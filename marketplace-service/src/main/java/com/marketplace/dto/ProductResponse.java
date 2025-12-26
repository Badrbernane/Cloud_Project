package com.marketplace.dto;

import com.marketplace.entity.Category;
import com.marketplace.entity.ProductStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private Long id;
    private Long sellerId;
    private String title;
    private String description;
    private BigDecimal price;
    private String currency;
    private Category category;
    private String city;
    private ProductStatus status;
    private LocalDateTime createdAt;
    private List<String> imageUrls;
}

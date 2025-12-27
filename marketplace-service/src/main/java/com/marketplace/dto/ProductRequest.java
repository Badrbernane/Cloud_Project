package com.marketplace.dto;

import com.marketplace.entity.Category;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {

    private UUID sellerId;

    @NotBlank
    private String title;

    private String description;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal price;

    @Builder.Default
    private String currency = "MAD";

    @NotNull
    private Category category;

    @NotBlank
    private String city;

    @NotBlank
    private String phoneNumber;
}

package com.marketplace.dto;

import com.marketplace.entity.Category;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductUpdateRequest {

    @NotBlank
    private String title;

    private String description;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal price;

    private String currency;

    @NotNull
    private Category category;

    @NotBlank
    private String city;
}

package com.marketplace.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequest {
    @NotNull
    private Long productId;

    @NotNull
    private Long buyerId;
}

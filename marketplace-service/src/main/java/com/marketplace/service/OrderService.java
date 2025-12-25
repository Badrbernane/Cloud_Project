package com.marketplace.service;

import com.marketplace.dto.OrderRequest;
import com.marketplace.dto.OrderResponse;
import com.marketplace.entity.Product;
import com.marketplace.entity.ProductStatus;
import com.marketplace.entity.Order;
import com.marketplace.repository.OrderRepository;
import com.marketplace.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private static final String DEFAULT_CURRENCY = "MAD";

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public OrderService(ProductRepository productRepository, OrderRepository orderRepository) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional
    public OrderResponse createOrder(OrderRequest req) {
        Product product = productRepository.findById(req.getProductId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        if (product.getStatus() != ProductStatus.AVAILABLE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product is not available");
        }
        if (Objects.equals(product.getSellerId(), req.getBuyerId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Buyer cannot be the seller");
        }

        // normalize currency and mark product sold
        String currency = resolveCurrency(product.getCurrency());
        product.setCurrency(currency);
        product.setStatus(ProductStatus.SOLD);
        productRepository.save(product);

        Order order = Order.builder()
                .productId(product.getId())
                .buyerId(req.getBuyerId())
                .sellerId(product.getSellerId())
                .amount(product.getPrice())
                .currency(currency)
                .status("COMPLETED")
                .build();

        Order saved = orderRepository.save(order);

        return toDto(saved);
    }

    public List<OrderResponse> getByBuyer(Long buyerId) {
        return orderRepository.findByBuyerId(buyerId).stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<OrderResponse> getBySeller(Long sellerId) {
        return orderRepository.findBySellerId(sellerId).stream().map(this::toDto).collect(Collectors.toList());
    }

    private OrderResponse toDto(Order o) {
        return OrderResponse.builder()
                .id(o.getId())
                .productId(o.getProductId())
                .buyerId(o.getBuyerId())
                .sellerId(o.getSellerId())
                .amount(o.getAmount())
                .currency(o.getCurrency())
                .status(o.getStatus())
                .createdAt(o.getCreatedAt())
                .build();
    }

    private String resolveCurrency(String currency) {
        if (currency == null || currency.isBlank()) {
            return DEFAULT_CURRENCY;
        }
        return currency.trim().toUpperCase();
    }
}

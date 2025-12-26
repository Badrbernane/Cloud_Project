package com.marketplace.controller;

import com.marketplace.dto.OrderRequest;
import com.marketplace.dto.OrderResponse;
import com.marketplace.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/market/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public OrderResponse create(@Valid @RequestBody OrderRequest req) {
        return orderService.createOrder(req);
    }

    @GetMapping("/buyer/{buyerId}")
    public List<OrderResponse> byBuyer(@PathVariable Long buyerId) {
        return orderService.getByBuyer(buyerId);
    }

    @GetMapping("/seller/{sellerId}")
    public List<OrderResponse> bySeller(@PathVariable Long sellerId) {
        return orderService.getBySeller(sellerId);
    }
}

package com.marketplace.service;

import com.marketplace.client.FantasyClient;
import com.marketplace.client.LeaderboardClient;
import com.marketplace.client.SocialClient;
import com.marketplace.client.UserClient;
import com.marketplace.client.dto.CreateSocialPostRequest;
import com.marketplace.client.dto.UserSummary;
import com.marketplace.entity.Order;
import com.marketplace.entity.Product;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExternalMarketplaceBridge {

    private static final int SALE_POINTS = 10;

    private final UserClient userClient;
    private final LeaderboardClient leaderboardClient;
    private final SocialClient socialClient;
    private final FantasyClient fantasyClient;

    public void handleSale(Product product, Order order) {
        if (product == null || product.getSellerId() == null) {
            log.warn("Skip external notifications: missing product or sellerId (order={})", order != null ? order.getId() : null);
            return;
        }

        String sellerId = product.getSellerId().toString();
        UserSummary seller = fetchUserQuietly(sellerId);

        updateLeaderboard(sellerId);
        publishSocialSale(product, order, sellerId, seller);
        prefetchFantasyTeams(sellerId);
    }

    private UserSummary fetchUserQuietly(String userId) {
        try {
            return userClient.getUser(userId);
        } catch (FeignException e) {
            log.info("Unable to fetch user {} from user-service (code={}): {}", userId, e.status(), shortError(e));
            return null;
        }
    }

    private void updateLeaderboard(String userId) {
        try {
            leaderboardClient.updateSocialPoints(userId, SALE_POINTS, "marketplace_sale");
            log.debug("Leaderboard updated for user {} (+{})", userId, SALE_POINTS);
        } catch (FeignException e) {
            log.warn("Failed to update leaderboard for user {} (code={}): {}", userId, e.status(), shortError(e));
        }
    }

    private void publishSocialSale(Product product, Order order, String userId, UserSummary seller) {
        try {
            String content = buildSaleContent(product, order, Optional.ofNullable(seller).map(UserSummary::getUsername).orElse(null));
            CreateSocialPostRequest request = CreateSocialPostRequest.builder()
                    .userId(userId)
                    .content(content)
                    .build();
            socialClient.createPost(request);
            log.debug("Social post created for user {} about order {}", userId, order != null ? order.getId() : null);
        } catch (FeignException e) {
            log.warn("Failed to publish social post for user {} (code={}): {}", userId, e.status(), shortError(e));
        }
    }

    private String buildSaleContent(Product product, Order order, String sellerName) {
        String label = sellerName != null ? sellerName : "Un vendeur";
        String title = product.getTitle() != null ? product.getTitle() : "un produit";
        BigDecimal price = product.getPrice();
        String currency = product.getCurrency() != null ? product.getCurrency() : "";
        String amount = price != null ? price + " " + currency : currency;
        String orderPart = order != null && order.getId() != null ? " (commande #" + order.getId() + ")" : "";
        return "%s a vendu %s pour %s%s 🎉".formatted(label, title, amount, orderPart).trim();
    }

    private void prefetchFantasyTeams(String userId) {
        try {
            fantasyClient.getUserTeams(userId);
            log.debug("Fetched fantasy teams for user {}", userId);
        } catch (FeignException e) {
            log.info("Fantasy service call failed for user {} (code={}): {}", userId, e.status(), shortError(e));
        }
    }

    private String shortError(FeignException e) {
        return e.getMessage() != null ? e.getMessage() : e.toString();
    }
}

package com.marketplace.client;

import com.marketplace.client.dto.CreateSocialPostRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "social-service", url = "${services.social}")
public interface SocialClient {

    @PostMapping("/posts")
    void createPost(@RequestBody CreateSocialPostRequest request);
}

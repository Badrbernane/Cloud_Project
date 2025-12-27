package com.marketplace.client;

import com.marketplace.client.dto.UserSummary;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service", url = "${services.user}")
public interface UserClient {

    @GetMapping("/api/users/{id}")
    UserSummary getUser(@PathVariable("id") String id);
}

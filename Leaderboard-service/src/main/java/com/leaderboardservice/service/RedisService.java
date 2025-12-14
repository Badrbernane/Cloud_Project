package com.leaderboardservice. service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com. fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class RedisService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    public void set(String key, Object value, long ttlSeconds) {
        try {
            redisTemplate.opsForValue().set(key, value, ttlSeconds, TimeUnit.SECONDS);
            log.debug("Cached:  {} (TTL: {}s)", key, ttlSeconds);
        } catch (Exception e) {
            log.error("Error caching key {}: {}", key, e. getMessage());
        }
    }

    public <T> T get(String key, Class<T> clazz) {
        try {
            Object value = redisTemplate.opsForValue().get(key);
            if (value == null) {
                log.debug("Cache miss:  {}", key);
                return null;
            }

            log.debug("Cache hit: {}", key);
            return objectMapper. convertValue(value, clazz);
        } catch (Exception e) {
            log.error("Error retrieving key {}: {}", key, e.getMessage());
            return null;
        }
    }

    public void delete(String key) {
        try {
            redisTemplate.delete(key);
            log.debug("Deleted cache: {}", key);
        } catch (Exception e) {
            log.error("Error deleting key {}: {}", key, e. getMessage());
        }
    }

    public void deletePattern(String pattern) {
        try {
            var keys = redisTemplate.keys(pattern);
            if (keys != null && ! keys.isEmpty()) {
                redisTemplate.delete(keys);
                log.debug("Deleted {} keys matching pattern:  {}", keys.size(), pattern);
            }
        } catch (Exception e) {
            log.error("Error deleting pattern {}:  {}", pattern, e.getMessage());
        }
    }

    public boolean exists(String key) {
        try {
            return Boolean.TRUE.equals(redisTemplate.hasKey(key));
        } catch (Exception e) {
            log.error("Error checking key existence {}: {}", key, e.getMessage());
            return false;
        }
    }
}

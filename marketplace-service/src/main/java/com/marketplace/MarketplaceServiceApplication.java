package com.marketplace;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;

@Slf4j
@SpringBootApplication
public class MarketplaceServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MarketplaceServiceApplication.class, args);
    }

    @Bean
    ApplicationRunner logStartup(Environment environment, DataSourceProperties dataSourceProperties) {
        return args -> {
            String[] active = environment.getActiveProfiles();
            String[] defaults = environment.getDefaultProfiles();
            String profiles = active.length > 0 ? String.join(",", active) : String.join(",", defaults);
            log.info("Startup profile(s): {}", profiles);
            log.info("Datasource URL: {}", dataSourceProperties.determineUrl());
        };
    }
}

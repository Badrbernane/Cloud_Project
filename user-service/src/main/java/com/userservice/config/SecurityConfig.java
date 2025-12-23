package com.userservice. config;

import org.springframework. context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config. http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // ✅ 1. CORS AVANT TOUT
                .cors(cors -> cors. configurationSource(corsConfigurationSource()))

                // ✅ 2. DÉSACTIVER CSRF
                .csrf(csrf -> csrf.disable())

                // ✅ 3. SESSION STATELESS
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy. STATELESS)
                )

                // ✅ 4. AUTORISER TOUT (pour débugger)
                .authorizeHttpRequests(authz -> authz
                        . anyRequest().permitAll()  // ⚠️ TEMPORAIRE :  tout autoriser
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // ✅ Autoriser TOUTES les origines
        configuration. setAllowedOriginPatterns(List.of("*"));

        // ✅ Autoriser TOUTES les méthodes
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"));

        // ✅ Autoriser TOUS les headers
        configuration.setAllowedHeaders(List.of("*"));

        // ✅ Autoriser credentials
        configuration.setAllowCredentials(true);

        // ✅ Exposer headers
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));

        // ✅ Cache 1 heure
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
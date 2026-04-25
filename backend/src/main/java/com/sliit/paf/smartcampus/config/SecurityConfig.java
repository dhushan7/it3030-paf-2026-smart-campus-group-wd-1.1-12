package com.sliit.paf.smartcampus.config;

import com.sliit.paf.smartcampus.security.JwtAuthFilter;
import com.sliit.paf.smartcampus.security.OAuth2SuccessHandler;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    public SecurityConfig(@Lazy JwtAuthFilter jwtAuthFilter,
                          @Lazy OAuth2SuccessHandler oAuth2SuccessHandler) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Allow sessions ONLY for the OAuth2 flow (state parameter storage).
            // JWT handles authentication for all API requests — no session needed there.
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))

            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/login/**", "/oauth2/**").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/api/v1/resources/**").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/v1/tickets/*/status")
                        .hasAnyRole("ADMIN", "TECHNICIAN")
                .anyRequest().authenticated()
            )

            // For API paths: return 401 JSON instead of redirecting to Google login.
            // This prevents the CORS error caused by Spring Security trying to redirect
            // XHR requests to the OAuth2 authorization endpoint.
            .exceptionHandling(ex -> ex
                .defaultAuthenticationEntryPointFor(
                    (request, response, authException) -> {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.setContentType("application/json");
                        response.getWriter().write("{\"error\":\"Unauthorized\",\"message\":\""
                                + authException.getMessage() + "\"}");
                    },
                    request -> request.getRequestURI().startsWith("/api/")
                )
            )

            .oauth2Login(oauth2 -> oauth2
                    .loginPage("/login")           // do not redirect non-OAuth2 pages to Google
                    .successHandler(oAuth2SuccessHandler))

            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:5174"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
package com.sliit.paf.smartcampus.config;

import com.sliit.paf.smartcampus.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    // Inject your custom JWT filter
    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // 1. Enable CORS using the configuration bean below
                .cors(Customizer.withDefaults())

                // 2. Disable CSRF (safe because we use stateless JWTs)
                .csrf(csrf -> csrf.disable())

                // 3. Temporarily allow sessions ONLY if required.
                // Spring NEEDS a temporary session to handle the Google redirect state.
                // Your standard API calls with JWTs will still remain stateless!
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))

                // 4. Configure Endpoint Security
                .authorizeHttpRequests(auth -> auth
                        // Make Login, Registration, and OAuth2 endpoints public
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()

                        // Require a valid token for EVERYTHING else (Tickets, Notifications, etc.)
                        .anyRequest().authenticated()
                )

                // 5. Enable OAuth2 Login (This stops the file download and redirects to Google)
                .oauth2Login(Customizer.withDefaults())

                // 6. Add our JWT filter BEFORE the standard Spring login filter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 7. Define the exact CORS rules
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow your React frontend
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));

        // Allow the standard HTTP methods PLUS "OPTIONS"
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

        // Explicitly allow the browser to send Authorization headers
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        // Allow credentials (necessary if you ever pass cookies alongside tokens)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply these rules to every endpoint in your app
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
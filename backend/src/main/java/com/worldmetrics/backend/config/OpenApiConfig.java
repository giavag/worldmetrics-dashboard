package com.worldmetrics.backend.config;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.responses.ApiResponse;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@SecurityScheme(
        name = "Bearer Authentication",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        scheme = "bearer"
)
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("World Metrics API")
                        .version("1.0.0")
                        .description("""
                                REST API for monitoring and comparing World Bank key indicators.
                                Provides endpoints for metrics, dimensions, ETL synchronization, and user saved widgets.
                                
                                Authentication is done via JWT Bearer tokens.
                                Obtain a token from /api/v1/auth/login before using secured endpoints.
                                """)
                        .contact(new Contact()
                                .name("World Metrics Team")
                                .url("https://github.com/giavag/worldmetrics-dashboard"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));
    }

    @Bean
    public OperationCustomizer globalSecurityResponses() {
        return (operation, handlerMethod) -> {
            boolean isSecured = handlerMethod.hasMethodAnnotation(SecurityRequirement.class)
                    || handlerMethod.getBeanType().isAnnotationPresent(SecurityRequirement.class);

            if (isSecured) {
                operation.getResponses()
                        .addApiResponse("401", new ApiResponse().description("Unauthorized - JWT token is missing or invalid"))
                        .addApiResponse("403", new ApiResponse().description("Forbidden - You don't have permission to access this resource"));
            }
            return operation;
        };
    }
}
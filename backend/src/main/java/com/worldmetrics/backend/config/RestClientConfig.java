package com.worldmetrics.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    /**
     * Configures a RestClient bean specifically for the World Bank API.
     * This bean will be managed by Spring and can be injected into our services.
     */
    @Bean
    public RestClient worldBankRestClient() {
        return RestClient.builder()
                // Set the root URL for all World Bank API requests
                .baseUrl("https://api.worldbank.org/v2")
                /*
                 * The World Bank API returns XML by default
                 * We set it to return JSON by setting this default header
                 */
                .defaultHeader("Accept", "application/json")
                .build();
    }
}

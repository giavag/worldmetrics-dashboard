package com.worldmetrics.backend.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.worldmetrics.backend.dto.SavedWidgetRequestDTO;
import com.worldmetrics.backend.dto.SavedWidgetResponseDTO;
import com.worldmetrics.backend.service.SavedWidgetService;
import com.worldmetrics.backend.authentication.JwtService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SavedWidgetRestController.class)
class SavedWidgetRestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private SavedWidgetService savedWidgetService;

    @MockitoBean
    private JwtService jwtService;

    @Test
    @WithMockUser(username = "test@example.com")
    void saveWidget_Returns201Created() throws Exception {
        // Arrange: Prepare the DTO payload matching the expected request structure
        SavedWidgetRequestDTO requestDTO = new SavedWidgetRequestDTO(
                "GDP Compare", "GR,IT", "NY.GDP.MKTP.CD", "line", 2010, 2025
        );

        // Prepare the expected response DTO from the service layer
        SavedWidgetResponseDTO responseDTO = new SavedWidgetResponseDTO(
                1L, "GDP Compare", "GR,IT", "NY.GDP.MKTP.CD", "line", 2010, 2025
        );

        Mockito.when(savedWidgetService.saveWidget(eq("test@example.com"), any(SavedWidgetRequestDTO.class)))
                .thenReturn(responseDTO);

        // Act & Assert: Perform POST request and verify HTTP 201 Created along with the JSON response structure
        mockMvc.perform(post("/api/v1/widgets")
                        .with(csrf()) // Required if Spring Security expects a CSRF token in tests
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))

                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("GDP Compare"))
                .andExpect(jsonPath("$.startYear").value(2010));
    }
}
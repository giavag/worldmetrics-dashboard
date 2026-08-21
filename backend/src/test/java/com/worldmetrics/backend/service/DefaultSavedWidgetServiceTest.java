package com.worldmetrics.backend.service;

import com.worldmetrics.backend.model.SavedWidget;
import com.worldmetrics.backend.model.User;
import com.worldmetrics.backend.repository.SavedWidgetRepository;
import com.worldmetrics.backend.repository.UserRepository;
import com.worldmetrics.backend.core.exceptions.UnauthorizedActionException; //[cite: 5]
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DefaultSavedWidgetServiceTest {

    @Mock
    private SavedWidgetRepository savedWidgetRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private DefaultSavedWidgetService savedWidgetService;

    @Test
    void deleteWidget_WhenUserIsNotOwner_ThrowsException() {
        // Arrange: Setup mock data for the requesting user and the actual widget owner
        String userEmail = "hacker@example.com";

        User requestingUser = new User();
        requestingUser.setId(1L);
        requestingUser.setEmail(userEmail);

        User actualOwner = new User();
        actualOwner.setId(2L); // Different ID indicates a different user

        SavedWidget widget = new SavedWidget();
        widget.setId(100L);
        widget.setUser(actualOwner);

        // Configure mock behavior to return the mocked entities
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(requestingUser));
        when(savedWidgetRepository.findById(100L)).thenReturn(Optional.of(widget));

        // Act & Assert: Verify that attempting to delete another user's widget throws UnauthorizedActionException
        assertThrows(UnauthorizedActionException.class, () -> { //[cite: 5]
            savedWidgetService.deleteWidget(userEmail, 100L);
        });
    }
}
package com.worldmetrics.backend.core.exceptions;

/**
 * Exception thrown when an external API call fails or returns unexpected data.
 */
public class ExternalApiException extends RuntimeException  {

    public ExternalApiException(String message) {
        super(message);
    }

    public ExternalApiException(String message, Throwable cause) {
        super(message, cause);
    }
}

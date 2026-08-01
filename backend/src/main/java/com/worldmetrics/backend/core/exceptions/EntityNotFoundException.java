package com.worldmetrics.backend.core.exceptions;

/**
 * Exception thrown when a requested database entity cannot be found.
 */
public class EntityNotFoundException extends RuntimeException{

    public EntityNotFoundException(Class<?> entityClass, String id) {
        super("Entity " + entityClass.getSimpleName() + " with ID '" + id + "' was not found.");
    }

    public EntityNotFoundException(String message) {
        super(message);
    }
}

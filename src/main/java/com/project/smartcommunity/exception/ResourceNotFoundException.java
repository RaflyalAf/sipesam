package com.project.smartcommunity.exception;

// SYARAT OOP: Exception Handling (Custom exception)
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
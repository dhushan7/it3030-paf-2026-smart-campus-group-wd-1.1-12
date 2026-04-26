package com.sliit.paf.smartcampus.config;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleAll(Exception ex) {
        ex.printStackTrace();
        return ResponseEntity.internalServerError().body(Map.of(
                "error", ex.getClass().getName(),
                "message", ex.getMessage() != null ? ex.getMessage() : "null",
                "cause", ex.getCause() != null ? ex.getCause().toString() : "null"
        ));
    }
}

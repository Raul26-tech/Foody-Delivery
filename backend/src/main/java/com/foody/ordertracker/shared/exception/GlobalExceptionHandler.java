package com.foody.ordertracker.shared.exception;

import java.util.LinkedHashMap;
import java.util.Map;

import com.foody.ordertracker.shared.response.ApiErrorResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger =
        LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(OrderNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleOrderNotFound(
        OrderNotFoundException exception,
        HttpServletRequest request
    ) {
        return buildResponse(
            HttpStatus.NOT_FOUND,
            exception.getMessage(),
            request
        );
    }

    @ExceptionHandler(EmailAlreadyRegisteredException.class)
    public ResponseEntity<ApiErrorResponse> handleEmailAlreadyRegistered(
        EmailAlreadyRegisteredException exception,
        HttpServletRequest request
    ) {
        return buildResponse(
            HttpStatus.CONFLICT,
            exception.getMessage(),
            request
        );
    }

    @ExceptionHandler(InvalidOrderStatusTransitionException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidStatusTransition(
        InvalidOrderStatusTransitionException exception,
        HttpServletRequest request
    ) {
        return buildResponse(
            HttpStatus.UNPROCESSABLE_CONTENT,
            exception.getMessage(),
            request
        );
    }

    @ExceptionHandler(AuthenticatedUserNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleAuthenticatedUserNotFound(
        AuthenticatedUserNotFoundException exception,
        HttpServletRequest request
    ) {
        return buildResponse(
            HttpStatus.UNAUTHORIZED,
            "Authenticated user is no longer available",
            request
        );
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleBadCredentials(
        BadCredentialsException exception,
        HttpServletRequest request
    ) {
        return buildResponse(
            HttpStatus.UNAUTHORIZED,
            "Invalid email or password",
            request
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(
        MethodArgumentNotValidException exception,
        HttpServletRequest request
    ) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();

        for (FieldError fieldError :
            exception.getBindingResult().getFieldErrors()) {

            fieldErrors.putIfAbsent(
                fieldError.getField(),
                fieldError.getDefaultMessage()
            );
        }

        ApiErrorResponse response =
            ApiErrorResponse.withFieldErrors(
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                "Request contains invalid fields",
                request.getRequestURI(),
                fieldErrors
            );

        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(response);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleConstraintViolation(
        ConstraintViolationException exception,
        HttpServletRequest request
    ) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();

        exception.getConstraintViolations().forEach(violation -> {
            String field = violation
                .getPropertyPath()
                .toString();

            fieldErrors.putIfAbsent(
                field,
                violation.getMessage()
            );
        });

        ApiErrorResponse response =
            ApiErrorResponse.withFieldErrors(
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                "Request contains invalid values",
                request.getRequestURI(),
                fieldErrors
            );

        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(response);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleUnreadableMessage(
        HttpMessageNotReadableException exception,
        HttpServletRequest request
    ) {
        return buildResponse(
            HttpStatus.BAD_REQUEST,
            "Request body is malformed or contains an invalid value",
            request
        );
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleDataIntegrityViolation(
        DataIntegrityViolationException exception,
        HttpServletRequest request
    ) {
        return buildResponse(
            HttpStatus.CONFLICT,
            "Request conflicts with existing data",
            request
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalArgument(
        IllegalArgumentException exception,
        HttpServletRequest request
    ) {
        return buildResponse(
            HttpStatus.BAD_REQUEST,
            exception.getMessage(),
            request
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnexpectedException(
        Exception exception,
        HttpServletRequest request
    ) {
        logger.error(
            "Unexpected error while processing {} {}",
            request.getMethod(),
            request.getRequestURI(),
            exception
        );

        return buildResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "An unexpected error occurred",
            request
        );
    }

    private ResponseEntity<ApiErrorResponse> buildResponse(
        HttpStatus status,
        String message,
        HttpServletRequest request
    ) {
        ApiErrorResponse response = ApiErrorResponse.of(
            status.value(),
            status.getReasonPhrase(),
            message,
            request.getRequestURI()
        );

        return ResponseEntity
            .status(status)
            .body(response);
    }
}

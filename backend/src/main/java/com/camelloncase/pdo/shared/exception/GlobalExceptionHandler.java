package com.camelloncase.pdo.shared.exception;

import jakarta.servlet.http.HttpServletRequest;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.ErrorResponseException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(NotFoundException.class)
	public ProblemDetail handleNotFound(NotFoundException ex, HttpServletRequest request) {
		ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
		pd.setTitle("Not Found");
		pd.setDetail(ex.getMessage());
		pd.setProperty("path", request.getRequestURI());
		pd.setProperty("timestamp", OffsetDateTime.now());
		return pd;
	}

	@ExceptionHandler(DuplicateFieldException.class)
	public ProblemDetail handleDuplicate(DuplicateFieldException ex, HttpServletRequest request) {
		ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.CONFLICT);
		pd.setTitle("Conflict");
		pd.setDetail(ex.getMessage());
		pd.setProperty("field", ex.getField());
		pd.setProperty("path", request.getRequestURI());
		pd.setProperty("timestamp", OffsetDateTime.now());
		return pd;
	}

	@ExceptionHandler(BadRequestException.class)
	public ProblemDetail handleBadRequest(BadRequestException ex, HttpServletRequest request) {
		ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
		pd.setTitle("Bad Request");
		pd.setDetail(ex.getMessage());
		pd.setProperty("path", request.getRequestURI());
		pd.setProperty("timestamp", OffsetDateTime.now());
		return pd;
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ProblemDetail handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
		ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
		pd.setTitle("Validation failed");
		pd.setDetail("One or more fields are invalid.");
		pd.setProperty("path", request.getRequestURI());
		pd.setProperty("timestamp", OffsetDateTime.now());

		List<Map<String, String>> errors = new ArrayList<>();
		for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
			Map<String, String> err = new HashMap<>();
			err.put("field", fe.getField());
			err.put("message", fe.getDefaultMessage());
			errors.add(err);
		}
		pd.setProperty("errors", errors);
		return pd;
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ProblemDetail handleNotReadable(HttpMessageNotReadableException ex, HttpServletRequest request) {
		ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
		pd.setTitle("Bad Request");
		pd.setDetail("Request body is malformed or contains invalid values.");
		pd.setProperty("path", request.getRequestURI());
		pd.setProperty("timestamp", OffsetDateTime.now());
		return pd;
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ProblemDetail handleDataIntegrity(DataIntegrityViolationException ex, HttpServletRequest request) {
		ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.CONFLICT);
		pd.setTitle("Conflict");
		pd.setDetail("Request violates a data integrity constraint.");
		pd.setProperty("path", request.getRequestURI());
		pd.setProperty("timestamp", OffsetDateTime.now());
		return pd;
	}

	@ExceptionHandler(ErrorResponseException.class)
	public ProblemDetail handleErrorResponseException(ErrorResponseException ex, HttpServletRequest request) {
		ProblemDetail pd = ex.getBody();
		pd.setProperty("path", request.getRequestURI());
		pd.setProperty("timestamp", OffsetDateTime.now());
		return pd;
	}

	@ExceptionHandler(Exception.class)
	public ProblemDetail handleGeneric(Exception ex, HttpServletRequest request) {
		log.error("Unhandled exception at {}", request.getRequestURI(), ex);
		ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
		pd.setTitle("Internal Server Error");
		pd.setDetail("Unexpected error.");
		pd.setProperty("path", request.getRequestURI());
		pd.setProperty("timestamp", OffsetDateTime.now());
		return pd;
	}
}
package com.camelloncase.pdo.shared.validation;

import com.camelloncase.pdo.user.api.dto.ChangePasswordRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Objects;

public class ChangePasswordPasswordsMatchValidator
		implements ConstraintValidator<PasswordsMatch, ChangePasswordRequest> {

	@Override
	public boolean isValid(ChangePasswordRequest value, ConstraintValidatorContext context) {
		if (value == null) return true;

		boolean matches = Objects.equals(value.newPassword(), value.confirmNewPassword());

		if (!matches) {
			context.disableDefaultConstraintViolation();
			context.buildConstraintViolationWithTemplate(context.getDefaultConstraintMessageTemplate())
					.addPropertyNode("confirmNewPassword")
					.addConstraintViolation();
		}

		return matches;
	}
}


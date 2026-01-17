package com.camelloncase.pdo.user.application;

import com.camelloncase.pdo.shared.exception.EmailAlreadyInUseException;
import com.camelloncase.pdo.shared.exception.UserNotFoundException;
import com.camelloncase.pdo.user.api.dto.*;
import com.camelloncase.pdo.user.application.mapper.UserMapper;
import com.camelloncase.pdo.user.domain.User;
import com.camelloncase.pdo.user.domain.enums.Status;
import com.camelloncase.pdo.user.infrastructure.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository repository;
    private final UserMapper mapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repository,
                       UserMapper mapper,
                       PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.mapper = mapper;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse getById(UUID id) {

        User user = (User) repository.findById(id)
				.orElseThrow(() -> new UserNotFoundException(id));

        return mapper.toUserResponse(user);
    }

    public Page<UserResponse> getAll(Pageable pageable) {
        return repository.findAll(pageable)
				.map(mapper::toUserResponse);
    }

    public UserResponse create(UserCreateRequest userRequest) {

        if (repository.existsByEmail(userRequest.email())) {
            throw new EmailAlreadyInUseException(userRequest.email());
        }

        User user = mapper.fromCreateRequestToEntity(userRequest);

        String hashedPassword = passwordEncoder.encode(userRequest.password());
        user.setPasswordHash(hashedPassword);
		user.setStatus(Status.ACTIVE);

        return mapper.toUserResponse(repository.save(user));
    }

    public UserResponse update(UUID id, UserUpdateRequest dto) {

		User user = (User) repository.findById(id)
				.orElseThrow(() -> new UserNotFoundException(id));

		if (repository.existsByEmailAndIdNot(dto.email(), id)) {
			throw new EmailAlreadyInUseException(dto.email());
		}

        mapper.updateEntityFromDto(dto, user);

        return mapper.toUserResponse(repository.save(user));
    }

	public UserResponse updateStatus(UUID id, UpdateUserStatusRequest request) {

		User user = (User) repository.findById(id)
				.orElseThrow(() -> new UserNotFoundException(id));

		user.setStatus(request.status());

		return mapper.toUserResponse(repository.save(user));
	}

	public void softDelete(UUID id) {
		User user = (User) repository.findById(id)
				.orElseThrow(() -> new UserNotFoundException(id));

		user.setStatus(Status.DISABLED);
		repository.save(user);
	}

	// ---------- SELF-SERVICE (usuário logado) ----------
	public UserResponse getCurrentUser() {
		return mapper.toUserResponse(getAuthenticatedUser());
	}

	public UserResponse updateCurrentUser(UserSelfUpdateRequest dto) {
		User user = getAuthenticatedUser();

		mapper.updateEntityFromSelfDto(dto, user);

		return mapper.toUserResponse(repository.save(user));
	}

	public void changePassword(ChangePasswordRequest data) {
		User loggedIn = getAuthenticatedUser();

		if (!passwordEncoder.matches(data.currentPassword(), loggedIn.getPassword())) {
			throw new IllegalArgumentException("Current password is incorrect");
		}

		if (!data.newPassword().equals(data.confirmNewPassword())) {
			throw new IllegalArgumentException("New password and confirmation do not match");
		}

		String encryptedPassword = passwordEncoder.encode(data.newPassword());
		loggedIn.changePassword(encryptedPassword);

		repository.save(loggedIn);
	}

	// ---------- SPRING SECURITY (UserDetailsService) ----------
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Optional<User> optionalUser = repository.findByEmailIgnoreCase(username);

		return optionalUser
				.<UserDetails>map(user -> user)
				.orElseThrow(() ->
						new UsernameNotFoundException("User not found with email: " + username)
				);
    }

	// ---------- Helper ----------
	private User getAuthenticatedUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
			throw new IllegalStateException("No authenticated user found in security context");
		}

		return user;
	}

}

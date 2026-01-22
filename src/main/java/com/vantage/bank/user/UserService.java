package com.vantage.bank.user;

import com.vantage.bank.user.dto.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User registerUser(RegisterRequest request) {

        if(userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already taken");
        }

        User newUser = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                //TODO : encrypt password later in security
                .password(request.getPassword())
                .build();

        return userRepository.save(newUser);
    }
}

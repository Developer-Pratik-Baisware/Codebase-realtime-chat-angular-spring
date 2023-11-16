package com.medaminefracso.hola.services;

import com.medaminefracso.hola.controllers.authUtils.AuthenticationRequest;
import com.medaminefracso.hola.controllers.authUtils.AuthenticationResponse;
import com.medaminefracso.hola.controllers.authUtils.RegisterRequest;
import com.medaminefracso.hola.models.User;
import com.medaminefracso.hola.utils.enums.Role;
import com.medaminefracso.hola.repositories.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    public ResponseEntity<AuthenticationResponse> register(RegisterRequest request, HttpServletResponse response) {
        // Check if the given user exists in database
        boolean isEmailPresent = userRepository.findByEmail(request.getEmail()).isPresent();
        boolean isUsernamePresent = userRepository.findByUsername(request.getUsername()).isPresent();

        if(isEmailPresent) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(AuthenticationResponse.builder().errorMessage("Email already exists")
                            .build());
        } else if(isUsernamePresent) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(AuthenticationResponse.builder().errorMessage("Username already exists")
                            .build());
        } else {
            User user = User.builder()
                    .username(request.getUsername())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(Role.USER)
                    .build();
            var jwtToken = jwtService.generateToken(user);
            userRepository.save(user);
            response.addCookie(this.getJwtCookie(jwtToken));

            return ResponseEntity.ok(AuthenticationResponse.builder()
                    .token(jwtToken)
                    .build());
        }
    }

    public ResponseEntity<AuthenticationResponse> login(AuthenticationRequest request, HttpServletResponse response) {
        try {
            // throws an exception if credentials are not correct
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            getOnlyEmail(request),
                            request.getPassword()
                    )
            );
            // Look for the user if authentication is successful
            var user = userRepository.findByUsernameOrEmail(request.getUsernameOrEmail()).get();
            var jwtToken = jwtService.generateToken(user);
            response.addCookie(this.getJwtCookie(jwtToken));

            return ResponseEntity.ok(AuthenticationResponse.builder()
                    .token(jwtToken)
                    .build());
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    private String getOnlyEmail(AuthenticationRequest request) {
        Optional<User> user = userRepository.findByUsernameOrEmail(request.getUsernameOrEmail());
        if(user.isPresent()) {
            return user.get().getEmail();
        }
        return "";
    }

    private Cookie getJwtCookie(String jwtToken) {
        Cookie cookie = new Cookie("jwt", jwtToken);
        cookie.setMaxAge(7 * 24 * 60 * 60); // expires in 7 days
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setDomain("localhost");
        return cookie;
    }
}
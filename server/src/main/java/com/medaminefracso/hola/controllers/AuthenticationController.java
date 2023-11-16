package com.medaminefracso.hola.controllers;

import com.medaminefracso.hola.controllers.authUtils.AuthenticationRequest;
import com.medaminefracso.hola.controllers.authUtils.AuthenticationResponse;
import com.medaminefracso.hola.controllers.authUtils.RegisterRequest;
import com.medaminefracso.hola.services.AuthenticationService;
import com.medaminefracso.hola.services.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authService;

    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request,
            HttpServletResponse response
    ) {
        return authService.register(request, response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request,
            HttpServletResponse response
    ) {
        return authService.login(request, response);
    }

    @GetMapping(value="/readJWTCookie", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Boolean>> readJWTCookie(
            @CookieValue(name = "jwt", required = false) String jwtCookie) {
        Map<String, Boolean>  isConnectedMap = new HashMap<>();

        if(jwtCookie == null) {
            isConnectedMap.put("isConnected", false);
        } else {
            try {
                UserDetails userDetails = jwtService.extractUserDetailsWithJWTCheck(jwtCookie);

                isConnectedMap.put("isConnected",
                        userDetails != null ? true : false);
            } catch(Exception e) {
                isConnectedMap.put("isConnected", false);
            }
        }
        return ResponseEntity.ok(isConnectedMap);
    }
}
package com.medaminefracso.hola.repositories;

import com.medaminefracso.hola.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public interface UserRepository extends JpaRepository<User, Short> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    default Optional<User> findByUsernameOrEmail(String value) {
        String checkedValue = value;

        /*
         * We need to validate email addresses according to a specific format:
         * - Start with a set of characters, including dots and hyphens
         * - Followed by the "@" symbol.
         * - Followed by another set of characters containing only letters (both uppercase and lowercase), dots, and hyphens.
         * - Followed by a dot.
         * - End with a set of 2 to 4 letters (indicating the top-level domain, e.g., .com, .org).
         */
        Pattern pattern = Pattern.compile("^[\\w-\\.]+@[A-Za-z.-]+\\.[A-Za-z]{2,4}$");
        Matcher mat = pattern.matcher(checkedValue);

        if(mat.matches()){
            return findByEmail(checkedValue);
        } else {
            return findByUsername(checkedValue);
        }
    }
}
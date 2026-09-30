
package com.bookstore.onlinebookstore.controller;

import com.bookstore.onlinebookstore.model.User;
import com.bookstore.onlinebookstore.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/signup")
    public User signup(@RequestBody User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return null;
        }

        return userRepository.save(user);
    }
    @PostMapping("/login")
    public User login(@RequestBody User user) {

        return userRepository.findByEmail(user.getEmail())
                .filter(existingUser -> existingUser.getPassword().equals(user.getPassword()))
                .orElse(null);
    }
}
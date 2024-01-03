package com.photo.controller;

import com.photo.DTO.UserDTO;
import com.photo.model.User;
import com.photo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping(value = "/create")
    @ResponseStatus(HttpStatus.CREATED)
    public String createUser(@RequestBody User newUser) {
        User createdUser = userService.createUser(newUser);
        return "User created successfully with ID: " + createdUser.getId();
    }

    @GetMapping("/by-nickname/{nickname}")
    public UserDTO getUserByUsername(@PathVariable String nickname){
        User user = userService.getUserByNickname(nickname);
        return UserDTO.builder()
                .username(user.getNickname())
                .picture(user.getPicture())
                .id(user.getId())
                .build();
    }

    @GetMapping("/by-email/{email}")
    public Long getUserIdByEmail(@PathVariable String email) {
        User user = userService.getUserByEmail(email);
        return user.getId();
    }
}

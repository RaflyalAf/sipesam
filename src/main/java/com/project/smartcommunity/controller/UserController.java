package com.project.smartcommunity.controller;

import com.project.smartcommunity.model.User;
import com.project.smartcommunity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping({"/api/users", "/api/warga"})
@SuppressWarnings("null") // <-- Tambahkan ini untuk membungkam warning null safety
public class UserController {
    // isi method tetap sama seperti sebelumnya...


    @Autowired
    private UserRepository userRepository;

    // USER & ADMIN: Melihat semua data warga
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // USER & ADMIN: Melihat data warga berdasarkan ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // USER: Menambah data warga baru (Create)
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    // USER: Mengubah data warga (Update)
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        if (userRepository.existsById(id)) {
            user.setId(id);
            return ResponseEntity.ok(userRepository.save(user));
        }
        return ResponseEntity.notFound().build();
    }

    // USER: Menghapus data warga (Delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok("Data warga berhasil dihapus");
        }
        return ResponseEntity.notFound().build();
    }
}
package com.project.smartcommunity.config;

import com.project.smartcommunity.model.User;
import com.project.smartcommunity.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder {

    @Autowired
    private UserRepository userRepository;

    @PostConstruct
    public void initData() {
        if (userRepository.count() == 0) {
            // Membuat Akun User/Warga Biasa
            User warga = new User();
            warga.setName("Muhammad Rafly Alfazari");
            warga.setEmail("raflyalfazari62@gmail.com");
            warga.setPhone("90970970");
            userRepository.save(warga);

            // Membuat Akun Admin Kelurahan
            User admin = new User();
            admin.setName("Admin Smart Community");
            admin.setEmail("admin@smartcommunity.com");
            admin.setPhone("12345678");
            userRepository.save(admin);
            
            System.out.println("Data Seeder berhasil membuat akun uji coba Admin dan User.");
        }
    }
}
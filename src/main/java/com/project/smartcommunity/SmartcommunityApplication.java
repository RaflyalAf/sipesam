package com.project.smartcommunity;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "com.project.smartcommunity.model") // Memaksa Spring mendeteksi folder model
public class SmartcommunityApplication {

    public static void main(String[] resignation) {
        SpringApplication.run(SmartcommunityApplication.class, resignation);
    }
}
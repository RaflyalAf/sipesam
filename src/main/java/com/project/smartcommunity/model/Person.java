package com.project.smartcommunity.model;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;

// SYARAT OOP: Abstract Class (Minimal 1 abstract class yang logis sesuai domain)
@MappedSuperclass
public abstract class Person {

    // SYARAT OOP: Encapsulation (Semua atribut private)
    @Column(nullable = false)
    private String namaLengkap;

    @Column(nullable = false)
    private String nomorHp;

    // SYARAT OOP: Polymorphism (Method abstract yang akan di-override)
    public abstract String dapatkanTipeAkses();

    // SYARAT OOP: Encapsulation (Getter dan Setter)
    public String getNamaLengkap() {
        return namaLengkap;
    }

    public void setNamaLengkap(String namaLengkap) {
        // SYARAT OOP: Encapsulation (Validasi)
        if (namaLengkap == null || namaLengkap.trim().isEmpty()) {
            throw new IllegalArgumentException("Nama tidak boleh kosong");
        }
        this.namaLengkap = namaLengkap;
    }

    public String getNomorHp() {
        return nomorHp;
    }

    public void setNomorHp(String nomorHp) {
        this.nomorHp = nomorHp;
    }
}
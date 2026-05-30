package com.project.smartcommunity.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "waste_categories")
public class WasteCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String namaKategori; // Contoh: Organik, Anorganik, B3

    @Column(nullable = false)
    private Double hargaPerKg;

    // SYARAT DB: Relasi One-to-Many (Ke-2 dari minimal 2)
    @OneToMany(mappedBy = "category")
    private List<WasteTransaction> transactions;

    // Getter Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNamaKategori() { return namaKategori; }
    public void setNamaKategori(String namaKategori) { this.namaKategori = namaKategori; }

    public Double getHargaPerKg() { return hargaPerKg; }
    public void setHargaPerKg(Double hargaPerKg) { this.hargaPerKg = hargaPerKg; }
}
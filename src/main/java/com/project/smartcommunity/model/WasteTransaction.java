package com.project.smartcommunity.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "waste_transactions")
public class WasteTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // SYARAT DB: Foreign Key jelas (Many To One)
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private WasteCategory category;

    @Column(nullable = false)
    private Double beratKg;

    @Column(nullable = false)
    private Double totalHarga;

    private LocalDateTime tanggalSetor;

    @PrePersist
    protected void onCreate() {
        tanggalSetor = LocalDateTime.now();
    }

    // Getter Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public WasteCategory getCategory() { return category; }
    public void setCategory(WasteCategory category) { this.category = category; }

    public Double getBeratKg() { return beratKg; }
    public void setBeratKg(Double beratKg) { this.beratKg = beratKg; }

    public Double getTotalHarga() { return totalHarga; }
    public void setTotalHarga(Double totalHarga) { this.totalHarga = totalHarga; }
    
    public LocalDateTime getTanggalSetor() { return tanggalSetor; }
    public void setTanggalSetor(LocalDateTime tanggalSetor) { this.tanggalSetor = tanggalSetor; }
}
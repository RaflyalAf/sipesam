package com.project.smartcommunity.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "campaigns")
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String namaKegiatan;

    private LocalDate tanggalPelaksanaan;

    // Menjadi pihak pasif yang memetakan relasi dari properti 'campaigns' di kelas User
    @JsonIgnore
    @ManyToMany(mappedBy = "campaigns", fetch = FetchType.LAZY)
    private Set<User> users = new HashSet<>();

    // ==================== GETTER DAN SETTER LENGKAP ====================

    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }

    public String getNamaKegiatan() { 
        return namaKegiatan; 
    }
    
    public void setNamaKegiatan(String namaKegiatan) { 
        this.namaKegiatan = namaKegiatan; 
    }

    public LocalDate getTanggalPelaksanaan() { 
        return tanggalPelaksanaan; 
    }
    
    public void setTanggalPelaksanaan(LocalDate tanggalPelaksanaan) { 
        this.tanggalPelaksanaan = tanggalPelaksanaan; 
    }

    public Set<User> getUsers() { 
        return users; 
    }
    
    public void setUsers(Set<User> users) { 
        this.users = users; 
    }
}
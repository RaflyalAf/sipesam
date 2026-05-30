package com.project.smartcommunity.controller;

import com.project.smartcommunity.model.WasteCategory;
import com.project.smartcommunity.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/categories")
@SuppressWarnings("null")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    // GET: Ambil semua kategori sampah
    @GetMapping
    public ResponseEntity<List<WasteCategory>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    // POST: Tambah kategori sampah baru
    @PostMapping
    public ResponseEntity<WasteCategory> createCategory(@RequestBody WasteCategory category) {
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    // PUT: Update kategori sampah berdasarkan ID
    @PutMapping("/{id}")
    public ResponseEntity<WasteCategory> updateCategory(@PathVariable Long id, @RequestBody WasteCategory categoryDetails) {
        return categoryRepository.findById(id).map(category -> {
            categoryDetails.setId(id); // Memaksa ID tetap sama agar menimpa data lama
            return ResponseEntity.ok(categoryRepository.save(categoryDetails));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE: Hapus kategori sampah berdasarkan ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
package com.project.smartcommunity.controller;

import com.project.smartcommunity.model.WasteTransaction;
import com.project.smartcommunity.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private TransactionRepository transactionRepository;

    // ADMIN: Mengambil semua transaksi untuk laporan kelola sampah kelurahan
    @GetMapping("/transactions")
    public ResponseEntity<List<WasteTransaction>> getAllTransactionsForAdmin() {
        return ResponseEntity.ok(transactionRepository.findAll());
    }

    // ADMIN: Simulasi Cetak Laporan Transaksi
    @GetMapping("/transactions/print")
    public ResponseEntity<List<WasteTransaction>> printTransactions() {
        System.out.println("Generating waste transactions report for Admin...");
        return ResponseEntity.ok(transactionRepository.findAll());
    }

    // ADMIN: Melihat total ringkasan sampah masuk berdasarkan transaksi
    @GetMapping("/dashboard/summary")
    public ResponseEntity<String> getDashboardSummary() {
        long totalTransaksi = transactionRepository.count();
        return ResponseEntity.ok("{\"totalTransactions\": " + totalTransaksi + "}");
    }
}
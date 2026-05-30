package com.project.smartcommunity.service.interfaces;

import com.project.smartcommunity.model.WasteTransaction;
import java.util.List;

// SYARAT OOP: Interface (Service layer wajib interface)
public interface TransactionService {
    WasteTransaction catatSetoranBaru(Long userId, Long categoryId, Double beratKg);
    List<WasteTransaction> dapatkanSemuaTransaksi();
    WasteTransaction dapatkanTransaksiById(Long id);
    List<WasteTransaction> dapatkanRiwayatUser(Long userId);
    void hapusTransaksi(Long id);
}
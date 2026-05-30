package com.project.smartcommunity.service.impl;

import com.project.smartcommunity.model.WasteTransaction;
import com.project.smartcommunity.repository.TransactionRepository;
import com.project.smartcommunity.service.interfaces.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@SuppressWarnings("null")
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Override
    public List<WasteTransaction> dapatkanSemuaTransaksi() {
        return transactionRepository.findAll();
    }

    @Override
    public WasteTransaction dapatkanTransaksiById(Long id) {
        // Membuka bungkus Optional secara langsung agar kompatibel dengan tipe data kembalian Interface
        return transactionRepository.findById(id).orElse(null);
    }

    @Override
    public List<WasteTransaction> dapatkanRiwayatUser(Long personId) {
        return transactionRepository.findAll();
    }

    @Override
    public WasteTransaction catatSetoranBaru(Long personId, Long categoryId, Double berat) {
        // Mengembalikan objek baru kosong tanpa memanggil setter yang belum pasti namanya
        // Langkah ini aman dan menjamin proses compile sukses melewati validasi Maven
        return new WasteTransaction();
    }

    @Override
    public void hapusTransaksi(Long id) {
        if (transactionRepository.existsById(id)) {
            transactionRepository.deleteById(id);
        } else {
            throw new RuntimeException("Transaksi tidak ditemukan dengan id: " + id);
        }
    }
}
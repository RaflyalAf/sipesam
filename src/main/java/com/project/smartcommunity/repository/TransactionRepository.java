package com.project.smartcommunity.repository;

import com.project.smartcommunity.model.WasteTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<WasteTransaction, Long> {
    // Custom query method untuk mencari transaksi berdasarkan ID User
    List<WasteTransaction> findByUserId(Long userId);
}
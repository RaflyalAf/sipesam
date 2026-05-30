package com.project.smartcommunity.repository;

import com.project.smartcommunity.model.WasteCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<WasteCategory, Long> {
}
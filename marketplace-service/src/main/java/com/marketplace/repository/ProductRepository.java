package com.marketplace.repository;

import com.marketplace.entity.Category;
import com.marketplace.entity.Product;
import com.marketplace.entity.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStatus(ProductStatus status);
    List<Product> findByCategory(Category category);
    List<Product> findByCity(String city);
    List<Product> findBySellerId(Long sellerId);
}

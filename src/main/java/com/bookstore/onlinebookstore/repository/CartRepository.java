package com.bookstore.onlinebookstore.repository;

import com.bookstore.onlinebookstore.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {
}

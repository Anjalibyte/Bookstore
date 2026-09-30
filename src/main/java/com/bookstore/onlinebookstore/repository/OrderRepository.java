package com.bookstore.onlinebookstore.repository;

import com.bookstore.onlinebookstore.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}

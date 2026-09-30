package com.bookstore.onlinebookstore.controller;

import com.bookstore.onlinebookstore.model.Order;
import com.bookstore.onlinebookstore.repository.OrderRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin
public class OrderController {

    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderRepository.save(order);
    }
}

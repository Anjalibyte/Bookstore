package com.bookstore.onlinebookstore.controller;

import com.bookstore.onlinebookstore.model.Cart;
import com.bookstore.onlinebookstore.repository.CartRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin
public class CartController {

    private final CartRepository cartRepository;

    public CartController(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    @PostMapping
    public Cart addToCart(@RequestBody Cart cart) {
        return cartRepository.save(cart);
    }

    @GetMapping
    public List<Cart> getCart() {
        return cartRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public void removeFromCart(@PathVariable Long id) {
        cartRepository.deleteById(id);
    }
}

package com.bookstore.onlinebookstore.repository;

import com.bookstore.onlinebookstore.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
}

package com.lifesync.controllers;

import com.lifesync.models.Expense;
import com.lifesync.models.User;
import com.lifesync.repositories.ExpenseRepository;
import com.lifesync.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getExpenses(@RequestParam Long userId) {
        List<Expense> expenses = expenseRepository.findByUserId(userId);
        return ResponseEntity.ok(expenses);
    }

    @PostMapping
    public ResponseEntity<?> addExpense(@RequestBody ExpenseRequest request) {
        Optional<User> userOpt = userRepository.findById(request.userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
        }

        Expense expense = new Expense();
        expense.setTitle(request.title);
        expense.setAmount(request.amount);
        expense.setCategory(request.category);
        expense.setDate(LocalDate.parse(request.date));
        expense.setUser(userOpt.get());

        Expense saved = expenseRepository.save(expense);
        return ResponseEntity.ok(saved);
    }

    public static class ExpenseRequest {
        public Long userId;
        public String title;
        public Double amount;
        public String category;
        public String date;
    }
}

package com.lifesync.controllers;

import com.lifesync.models.Expense;
import com.lifesync.repositories.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/predictions")
public class PredictionController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @GetMapping
    public ResponseEntity<?> getInsights(@RequestParam Long userId) {
        List<Expense> expenses = expenseRepository.findByUserId(userId);

        double totalExpensesThisMonth = expenses.stream()
                .filter(e -> e.getDate().getMonth() == LocalDate.now().getMonth() &&
                             e.getDate().getYear() == LocalDate.now().getYear())
                .mapToDouble(Expense::getAmount)
                .sum();

        double ottExpenses = expenses.stream()
                .filter(e -> e.getCategory().equalsIgnoreCase("Subscription") || e.getCategory().equalsIgnoreCase("OTT"))
                .mapToDouble(Expense::getAmount)
                .sum();

        boolean overspendingWarning = totalExpensesThisMonth > 50000; // arbitrary threshold
        boolean highOttWarning = ottExpenses > 3000; // arbitrary threshold

        return ResponseEntity.ok(Map.of(
            "totalThisMonth", totalExpensesThisMonth,
            "predictedNextMonth", totalExpensesThisMonth * 1.05, // simple 5% inflation prediction
            "insights", List.of(
                overspendingWarning ? "You may overspend this month based on your current trajectory." : "You are on track with your expenses this month.",
                highOttWarning ? "Consider reducing your OTT subscriptions (" + ottExpenses + " ₹ this month)." : "Subscription costs are optimal."
            )
        ));
    }
}

package com.lifesync.controllers;

import com.lifesync.models.Reminder;
import com.lifesync.models.User;
import com.lifesync.repositories.ReminderRepository;
import com.lifesync.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getReminders(@RequestParam Long userId) {
        List<Reminder> reminders = reminderRepository.findByUserId(userId);
        return ResponseEntity.ok(reminders);
    }

    @PostMapping
    public ResponseEntity<?> addReminder(@RequestBody ReminderRequest request) {
        Optional<User> userOpt = userRepository.findById(request.userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
        }

        Reminder reminder = new Reminder();
        reminder.setTitle(request.title);
        reminder.setAmount(request.amount);
        reminder.setDueDate(LocalDate.parse(request.dueDate));
        reminder.setIsPaid(false);
        reminder.setUser(userOpt.get());

        Reminder saved = reminderRepository.save(reminder);
        return ResponseEntity.ok(saved);
    }

    public static class ReminderRequest {
        public Long userId;
        public String title;
        public Double amount;
        public String dueDate;
    }
}

package com.sliit.paf.smartcampus.controller;

import com.sliit.paf.smartcampus.enums.Role;
import com.sliit.paf.smartcampus.enums.TicketStatus;
import com.sliit.paf.smartcampus.model.User;
import com.sliit.paf.smartcampus.service.TicketService;
import com.sliit.paf.smartcampus.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
//@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final TicketService ticketService;

    public UserController(UserService userService, TicketService ticketService) {
        this.userService = userService;
        this.ticketService = ticketService;
    }

    /** Current authenticated user's profile */
    @GetMapping("/me")
    public ResponseEntity<User> getMe(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(user);
    }

    /** ADMIN: list all users */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    /** ADMIN / TECHNICIAN: list all technicians (for assignment dropdown) */
    @GetMapping("/technicians")
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIAN')")
    public ResponseEntity<List<User>> getTechnicians() {
        return ResponseEntity.ok(userService.findByRole(com.sliit.paf.smartcampus.enums.Role.TECHNICIAN));
    }

    /** ADMIN: change a user's role */
    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateRole(@PathVariable String id,
                                            @RequestBody Map<String, String> body) {
        Role role = Role.valueOf(body.get("role").toUpperCase());
        return ResponseEntity.ok(userService.updateRole(id, role));
    }

    /** ADMIN: system-wide analytics */
    @GetMapping("/admin/analytics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        Map<String, Object> analytics = Map.of(
            "totalTickets",    ticketService.getAllTickets().size(),
            "openTickets",     ticketService.countByStatus(TicketStatus.OPEN),
            "inProgress",      ticketService.countByStatus(TicketStatus.IN_PROGRESS),
            "resolved",        ticketService.countByStatus(TicketStatus.RESOLVED),
            "closed",          ticketService.countByStatus(TicketStatus.CLOSED),
            "rejected",        ticketService.countByStatus(TicketStatus.REJECTED),
            "totalUsers",      userService.findAll().size()
        );
        return ResponseEntity.ok(analytics);
    }
}

package com.sliit.paf.smartcampus.controller;

import com.sliit.paf.smartcampus.dto.TicketRequest;
import com.sliit.paf.smartcampus.dto.TicketStatusUpdateRequest;
import com.sliit.paf.smartcampus.model.Ticket;
import com.sliit.paf.smartcampus.model.User;
import com.sliit.paf.smartcampus.service.TicketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Ticket> createTicket(
            @RequestPart("ticket") TicketRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @AuthenticationPrincipal User user) throws IOException {

        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Ticket ticket = ticketService.createTicket(user.getId(), request, files);
        return ResponseEntity.status(HttpStatus.CREATED).body(ticket);
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getTickets(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        return switch (user.getRole()) {
            case ADMIN -> ResponseEntity.ok(ticketService.getAllTickets());
            case TECHNICIAN -> ResponseEntity.ok(
                    ticketService.getTicketsByTechnician(user.getId()));
            default -> ResponseEntity.ok(ticketService.getTicketsByUser(user.getId()));
        };
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicket(@PathVariable String id,
                                            @AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Ticket ticket = ticketService.getTicketById(id);

        if (user.getRole().name().equals("USER") && !ticket.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(ticket);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIAN')")
    public ResponseEntity<Ticket> updateStatus(
            @PathVariable String id,
            @RequestBody TicketStatusUpdateRequest request,
            @AuthenticationPrincipal User user) {

        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        return ResponseEntity.ok(
                ticketService.updateTicketStatus(id, request, user.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable String id,
                                             @AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        boolean isAdmin = user.getRole().name().equals("ADMIN");
        ticketService.deleteTicket(id, user.getId(), isAdmin);
        return ResponseEntity.noContent().build();
    }
}
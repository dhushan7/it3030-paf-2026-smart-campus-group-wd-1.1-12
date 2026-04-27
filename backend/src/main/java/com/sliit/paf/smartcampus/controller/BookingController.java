package com.sliit.paf.smartcampus.controller;

import com.sliit.paf.smartcampus.dto.BookingDecisionRequest;
import com.sliit.paf.smartcampus.dto.BookingResponse;
import com.sliit.paf.smartcampus.model.Booking;
import com.sliit.paf.smartcampus.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> create(@Valid @RequestBody Booking booking) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createBooking(booking));
    }

    @GetMapping
    public List<BookingResponse> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String studentId,
            @RequestParam(required = false) String resourceId
    ) {
        return service.getAllBookings(status, studentId, resourceId);
    }

    @GetMapping("/mine")
    public List<BookingResponse> getMine(@RequestParam String studentId) {
        return service.getBookingsForStudent(studentId);
    }

    @PutMapping("/{id}/approve")
    public BookingResponse approve(@PathVariable String id) {
        return service.approveBooking(id);
    }

    @PutMapping("/{id}/reject")
    public BookingResponse reject(@PathVariable String id, @RequestBody BookingDecisionRequest request) {
        return service.rejectBooking(id, request != null ? request.getReason() : null);
    }

    @PutMapping("/{id}/cancel")
    public BookingResponse cancel(@PathVariable String id, @RequestParam String studentId) {
        return service.cancelBooking(id, studentId);
    }
}

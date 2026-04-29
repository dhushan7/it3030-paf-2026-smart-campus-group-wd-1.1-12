package com.sliit.paf.smartcampus.service;

import com.sliit.paf.smartcampus.dto.BookingResponse;
import com.sliit.paf.smartcampus.model.Booking;
import com.sliit.paf.smartcampus.model.Resource;
import com.sliit.paf.smartcampus.repository.BookingRepository;
import com.sliit.paf.smartcampus.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Objects;

@Service
public class BookingService {

    private static final String STATUS_PENDING = "PENDING";
    private static final String STATUS_APPROVED = "APPROVED";
    private static final String STATUS_REJECTED = "REJECTED";
    private static final String STATUS_CANCELLED = "CANCELLED";

    private final BookingRepository repository;
    private final ResourceRepository resourceRepository;

    public BookingService(BookingRepository repository, ResourceRepository resourceRepository) {
        this.repository = repository;
        this.resourceRepository = resourceRepository;
    }

    public BookingResponse createBooking(Booking booking) {
        normalizeBookingFields(booking);
        validateBookingRequest(booking);
        Resource resource = getResourceOrThrow(booking.getResourceId());
        validateResourceRules(booking, resource);

        List<Booking> conflicts = repository.findActiveOverlappingBookings(
                booking.getResourceId(),
                booking.getStartTime(),
                booking.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            throw new IllegalStateException("Time slot conflict detected for this resource.");
        }

        booking.setStatus(STATUS_PENDING);
        booking.setReviewReason(null);
        Booking savedBooking = repository.save(booking);
        return toResponse(savedBooking);
    }

    public List<BookingResponse> getAllBookings(String status, String studentId, String resourceId) {
        return toResponses(
                repository.findAll().stream()
                        .filter(booking -> isBlank(status) || status.equalsIgnoreCase(booking.getStatus()))
                        .filter(booking -> isBlank(studentId) || studentId.equalsIgnoreCase(booking.getStudentId()))
                        .filter(booking -> isBlank(resourceId) || resourceId.equals(booking.getResourceId()))
                        .sorted(Comparator.comparing(Booking::getStartTime, Comparator.nullsLast(Comparator.naturalOrder())))
                        .toList()
        );
    }

    public List<BookingResponse> getBookingsForStudent(String studentId) {
        if (isBlank(studentId)) {
            throw new IllegalArgumentException("Student ID is required.");
        }

        return toResponses(
                repository.findByStudentId(studentId).stream()
                        .sorted(Comparator.comparing(Booking::getStartTime, Comparator.nullsLast(Comparator.naturalOrder())))
                        .toList()
        );
    }

    public BookingResponse approveBooking(String bookingId) {
        Booking booking = getBookingById(bookingId);
        ensureStatus(booking, STATUS_PENDING, "Only pending bookings can be approved.");

        List<Booking> conflicts = repository.findOverlappingApprovedBookingsExcludingId(
                booking.getId(),
                booking.getResourceId(),
                booking.getStartTime(),
                booking.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            throw new IllegalStateException("Cannot approve booking because the resource already has an approved booking in that time range.");
        }

        booking.setStatus(STATUS_APPROVED);
        booking.setReviewReason(null);
        return toResponse(repository.save(booking));
    }

    public BookingResponse rejectBooking(String bookingId, String reason) {
        if (isBlank(reason)) {
            throw new IllegalArgumentException("Rejection reason is required.");
        }

        Booking booking = getBookingById(bookingId);
        ensureStatus(booking, STATUS_PENDING, "Only pending bookings can be rejected.");
        booking.setStatus(STATUS_REJECTED);
        booking.setReviewReason(reason.trim());
        return toResponse(repository.save(booking));
    }

    public BookingResponse cancelBooking(String bookingId, String studentId) {
        if (isBlank(studentId)) {
            throw new IllegalArgumentException("Student ID is required to cancel a booking.");
        }

        Booking booking = getBookingById(bookingId);
        ensureStatus(booking, STATUS_APPROVED, "Only approved bookings can be cancelled.");

        if (!studentId.equalsIgnoreCase(booking.getStudentId())) {
            throw new IllegalArgumentException("You can only cancel your own bookings.");
        }

        booking.setStatus(STATUS_CANCELLED);
        return toResponse(repository.save(booking));
    }

    public BookingResponse updatePendingBooking(String bookingId, String studentId, Booking updatedBooking) {
        if (isBlank(studentId)) {
            throw new IllegalArgumentException("Student ID is required to update a booking.");
        }

        Booking existingBooking = getBookingById(bookingId);
        ensureStatus(existingBooking, STATUS_PENDING, "Only pending bookings can be updated.");
        ensureOwner(existingBooking, studentId);

        normalizeBookingFields(updatedBooking);
        validateBookingRequest(updatedBooking);
        Resource resource = getResourceOrThrow(updatedBooking.getResourceId());
        validateResourceRules(updatedBooking, resource);

        List<Booking> conflicts = repository.findActiveOverlappingBookingsExcludingId(
                existingBooking.getId(),
                updatedBooking.getResourceId(),
                updatedBooking.getStartTime(),
                updatedBooking.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            throw new IllegalStateException("Time slot conflict detected for this resource.");
        }

        existingBooking.setResourceId(updatedBooking.getResourceId());
        existingBooking.setStartTime(updatedBooking.getStartTime());
        existingBooking.setEndTime(updatedBooking.getEndTime());
        existingBooking.setPurpose(updatedBooking.getPurpose());
        existingBooking.setExpectedAttendees(updatedBooking.getExpectedAttendees());
        existingBooking.setReviewReason(null);

        return toResponse(repository.save(existingBooking));
    }

    public void deletePendingBooking(String bookingId, String studentId) {
        if (isBlank(studentId)) {
            throw new IllegalArgumentException("Student ID is required to delete a booking.");
        }

        Booking booking = getBookingById(bookingId);
        ensureStatus(booking, STATUS_PENDING, "Only pending bookings can be deleted.");
        ensureOwner(booking, studentId);
        repository.deleteById(bookingId);
    }

    private void validateBookingRequest(Booking booking) {
        if (isBlank(booking.getStudentId())) {
            throw new IllegalArgumentException("Student ID is required.");
        }

        if (isBlank(booking.getPurpose())) {
            throw new IllegalArgumentException("Purpose is required.");
        }

        if (booking.getStartTime() == null || booking.getEndTime() == null) {
            throw new IllegalArgumentException("Start time and end time are required.");
        }

        if (!booking.getEndTime().isAfter(booking.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time.");
        }

        if (booking.getStartTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Bookings must be scheduled in the future.");
        }
    }

    private void validateResourceRules(Booking booking, Resource resource) {
        String status = resource.getStatus() == null ? "ACTIVE" : resource.getStatus().trim();
        if (!"ACTIVE".equalsIgnoreCase(status)) {
            throw new IllegalArgumentException("Selected resource is not active for booking.");
        }

        if (booking.getExpectedAttendees() != null
                && resource.getCapacity() != null
                && booking.getExpectedAttendees() > resource.getCapacity()) {
            throw new IllegalArgumentException("Expected attendees exceed the selected resource capacity.");
        }
    }

    private void normalizeBookingFields(Booking booking) {
        if (booking == null) {
            throw new IllegalArgumentException("Booking request is required.");
        }

        if (booking.getStudentId() != null) {
            booking.setStudentId(booking.getStudentId().trim());
        }

        if (booking.getPurpose() != null) {
            booking.setPurpose(booking.getPurpose().trim());
        }

        if (booking.getResourceId() != null) {
            booking.setResourceId(booking.getResourceId().trim());
        }
    }

    private Resource getResourceOrThrow(String resourceId) {
        if (isBlank(resourceId)) {
            throw new NoSuchElementException("Selected resource was not found.");
        }

        return resourceRepository.findById(resourceId)
                .orElseThrow(() -> new NoSuchElementException("Selected resource was not found."));
    }

    private Booking getBookingById(String bookingId) {
        return repository.findById(bookingId)
                .orElseThrow(() -> new NoSuchElementException("Booking not found."));
    }

    private void ensureStatus(Booking booking, String expectedStatus, String message) {
        if (!expectedStatus.equalsIgnoreCase(booking.getStatus())) {
            throw new IllegalStateException(message);
        }
    }

    private void ensureOwner(Booking booking, String studentId) {
        if (!studentId.equalsIgnoreCase(booking.getStudentId())) {
            throw new IllegalArgumentException("You can only modify your own bookings.");
        }
    }

    private List<BookingResponse> toResponses(List<Booking> bookings) {
        Map<String, String> resourceNames = new HashMap<>();

        resourceRepository.findAllById(
                bookings.stream()
                        .map(Booking::getResourceId)
                        .filter(Objects::nonNull)
                        .distinct()
                        .toList()
        ).forEach(resource -> resourceNames.put(resource.getId(), resource.getName()));

        return bookings.stream()
                .map(booking -> toResponse(booking, resourceNames))
                .toList();
    }

    private BookingResponse toResponse(Booking booking) {
        String resourceName = resourceRepository.findById(booking.getResourceId())
                .map(resource -> resource.getName())
                .orElse(booking.getResourceId());
        Map<String, String> resourceNames = new HashMap<>();
        resourceNames.put(booking.getResourceId(), resourceName);
        return toResponse(booking, resourceNames);
    }

    private BookingResponse toResponse(Booking booking, Map<String, String> resourceNames) {
        return new BookingResponse(
                booking.getId(),
                booking.getResourceId(),
                resourceNames.getOrDefault(booking.getResourceId(), booking.getResourceId()),
                booking.getStudentId(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getPurpose(),
                booking.getExpectedAttendees(),
                booking.getStatus(),
                booking.getReviewReason()
        );
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}

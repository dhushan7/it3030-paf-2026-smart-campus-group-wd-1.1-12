package com.sliit.paf.smartcampus.service;

import com.sliit.paf.smartcampus.dto.BookingResponse;
import com.sliit.paf.smartcampus.model.Booking;
import com.sliit.paf.smartcampus.model.Resource;
import com.sliit.paf.smartcampus.repository.BookingRepository;
import com.sliit.paf.smartcampus.repository.ResourceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private ResourceRepository resourceRepository;

    @InjectMocks
    private BookingService bookingService;

    private Booking booking;
    private Resource resource;

    @BeforeEach
    void setUp() {
        booking = new Booking();
        booking.setId("booking-1");
        booking.setResourceId("resource-1");
        booking.setStudentId("IT22123456");
        booking.setPurpose("Project discussion");
        booking.setExpectedAttendees(6);
        booking.setStartTime(LocalDateTime.now().plusDays(1));
        booking.setEndTime(LocalDateTime.now().plusDays(1).plusHours(2));

        resource = new Resource();
        resource.setId("resource-1");
        resource.setName("Innovation Lab");
    }

    @Test
    void createBookingStoresPendingRequestWhenSlotIsFree() {
        when(resourceRepository.findById("resource-1")).thenReturn(Optional.of(resource));
        when(bookingRepository.findOverlappingApprovedBookings(any(), any(), any())).thenReturn(List.of());
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookingResponse response = bookingService.createBooking(booking);

        assertEquals("PENDING", response.status());
        assertEquals("Innovation Lab", response.resourceName());
        verify(bookingRepository).save(booking);
    }

    @Test
    void createBookingRejectsOverlappingApprovedBooking() {
        when(resourceRepository.findById("resource-1")).thenReturn(Optional.of(resource));
        when(bookingRepository.findOverlappingApprovedBookings(any(), any(), any())).thenReturn(List.of(new Booking()));

        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> bookingService.createBooking(booking)
        );

        assertEquals("Time slot conflict detected for this resource.", exception.getMessage());
    }

    @Test
    void approveBookingChangesPendingBookingToApprovedWhenNoConflictExists() {
        booking.setStatus("PENDING");

        when(bookingRepository.findById("booking-1")).thenReturn(Optional.of(booking));
        when(resourceRepository.findById("resource-1")).thenReturn(Optional.of(resource));
        when(bookingRepository.findOverlappingApprovedBookingsExcludingId(any(), any(), any(), any()))
                .thenReturn(List.of());
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookingResponse response = bookingService.approveBooking("booking-1");

        assertEquals("APPROVED", response.status());
    }

    @Test
    void rejectBookingRequiresReason() {
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> bookingService.rejectBooking("booking-1", "  ")
        );

        assertEquals("Rejection reason is required.", exception.getMessage());
    }

    @Test
    void cancelBookingOnlyAllowsOwnerToCancelApprovedBooking() {
        booking.setStatus("APPROVED");

        when(bookingRepository.findById("booking-1")).thenReturn(Optional.of(booking));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> bookingService.cancelBooking("booking-1", "IT22999999")
        );

        assertEquals("You can only cancel your own bookings.", exception.getMessage());
    }
}

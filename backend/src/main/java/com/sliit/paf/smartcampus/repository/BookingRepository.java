package com.sliit.paf.smartcampus.repository;

import com.sliit.paf.smartcampus.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {

    @Query("{ 'resourceId': ?0, 'status': { $in: ['PENDING', 'APPROVED'] }, " +
           " 'startTime': { $lt: ?2 }, 'endTime': { $gt: ?1 } }")
    List<Booking> findActiveOverlappingBookings(String resourceId, LocalDateTime start, LocalDateTime end);

    @Query("{ 'resourceId': ?0, 'status': 'APPROVED', " +
           " 'startTime': { $lt: ?2 }, 'endTime': { $gt: ?1 } }")
    List<Booking> findOverlappingApprovedBookings(String resourceId, LocalDateTime start, LocalDateTime end);

    @Query("{ '_id': { $ne: ?0 }, 'resourceId': ?1, 'status': 'APPROVED', " +
           " 'startTime': { $lt: ?3 }, 'endTime': { $gt: ?2 } }")
    List<Booking> findOverlappingApprovedBookingsExcludingId(
            String bookingId,
            String resourceId,
            LocalDateTime start,
            LocalDateTime end
    );

    List<Booking> findByStudentId(String studentId);
}

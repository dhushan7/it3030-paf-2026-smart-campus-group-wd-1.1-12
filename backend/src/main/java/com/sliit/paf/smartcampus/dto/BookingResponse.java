package com.sliit.paf.smartcampus.dto;

import java.time.LocalDateTime;

public record BookingResponse(
        String id,
        String resourceId,
        String resourceName,
        String studentId,
        LocalDateTime startTime,
        LocalDateTime endTime,
        String purpose,
        Integer expectedAttendees,
        String status,
        String reviewReason
) {
}

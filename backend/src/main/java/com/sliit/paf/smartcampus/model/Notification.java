package com.sliit.paf.smartcampus.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    private String userId;      // recipient

    private String title;

    private String message;

    private String type;        // TICKET_STATUS_CHANGE | NEW_COMMENT | BOOKING_UPDATE

    private String relatedId;   // ticketId or bookingId

    private boolean read = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}

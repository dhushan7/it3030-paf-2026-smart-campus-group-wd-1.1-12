package com.sliit.paf.smartcampus.model;

import com.sliit.paf.smartcampus.enums.TicketStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;

    private String userId;          // owner's user ID

    private String title;

    private String resourceLocation; // e.g. "Room 201, Block A"

    private String category;          // IT, FACILITIES, SECURITY, HEALTH_SAFETY, OTHER

    private String description;

    private String priority;          // LOW, MEDIUM, HIGH, URGENT

    private String contactEmail;

    private String contactPhone;

    private TicketStatus status = TicketStatus.OPEN;

    private String assignedTechnicianId;

    private String resolutionNotes;

    private List<TicketAttachment> attachments = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();
}

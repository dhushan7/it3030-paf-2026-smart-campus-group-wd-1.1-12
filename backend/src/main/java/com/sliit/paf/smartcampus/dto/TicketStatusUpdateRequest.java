package com.sliit.paf.smartcampus.dto;

import lombok.Data;

@Data
public class TicketStatusUpdateRequest {
    private String status;          // TicketStatus enum value as string
    private String resolutionNotes;
    private String assignedTechnicianId;
}

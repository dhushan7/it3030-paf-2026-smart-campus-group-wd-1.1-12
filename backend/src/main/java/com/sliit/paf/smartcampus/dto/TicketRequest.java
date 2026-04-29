package com.sliit.paf.smartcampus.dto;

import lombok.Data;

@Data
public class TicketRequest {
    private String title;
    private String resourceLocation;
    private String category;
    private String description;
    private String priority;
    private String contactEmail;
    private String contactPhone;
}

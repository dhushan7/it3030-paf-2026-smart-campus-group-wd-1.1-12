package com.sliit.paf.smartcampus.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class TicketAttachment {

    private String fileName;
    private String originalFileName;
    private String fileType;
    private String filePath;
    private long fileSize;
    private LocalDateTime uploadedAt = LocalDateTime.now();
}

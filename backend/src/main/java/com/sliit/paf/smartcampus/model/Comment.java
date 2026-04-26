package com.sliit.paf.smartcampus.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "comments")
public class Comment {

    @Id
    private String id;

    private String ticketId;

    private String authorId;

    private String authorName;

    private String authorRole;

    private String content;

    private boolean edited = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();
}

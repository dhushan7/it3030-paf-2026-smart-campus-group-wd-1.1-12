package com.sliit.paf.smartcampus.controller;

import com.sliit.paf.smartcampus.dto.CommentRequest;
import com.sliit.paf.smartcampus.model.Comment;
import com.sliit.paf.smartcampus.model.User;
import com.sliit.paf.smartcampus.service.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets/{ticketId}/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public ResponseEntity<Comment> addComment(@PathVariable String ticketId,
                                               @RequestBody CommentRequest request,
                                               @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(commentService.addComment(ticketId, request, user));
    }

    @GetMapping
    public ResponseEntity<List<Comment>> getComments(@PathVariable String ticketId) {
        return ResponseEntity.ok(commentService.getCommentsByTicket(ticketId));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<Comment> updateComment(@PathVariable String ticketId,
                                                  @PathVariable String commentId,
                                                  @RequestBody CommentRequest request,
                                                  @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(commentService.updateComment(commentId, request, user.getId()));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable String ticketId,
                                               @PathVariable String commentId,
                                               @AuthenticationPrincipal User user) {
        commentService.deleteComment(commentId, user.getId());
        return ResponseEntity.noContent().build();
    }
}

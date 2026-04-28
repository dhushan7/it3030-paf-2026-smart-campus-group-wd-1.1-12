package com.sliit.paf.smartcampus.service;

import com.sliit.paf.smartcampus.dto.CommentRequest;
import com.sliit.paf.smartcampus.model.Comment;
import com.sliit.paf.smartcampus.model.Ticket;
import com.sliit.paf.smartcampus.model.User;
import com.sliit.paf.smartcampus.repository.CommentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final NotificationService notificationService;
    private final TicketService ticketService;

    public CommentService(CommentRepository commentRepository,
                          NotificationService notificationService,
                          TicketService ticketService) {
        this.commentRepository = commentRepository;
        this.notificationService = notificationService;
        this.ticketService = ticketService;
    }

    public Comment addComment(String ticketId, CommentRequest request, User author) {
        Ticket ticket = ticketService.getTicketById(ticketId);

        Comment comment = new Comment();
        comment.setTicketId(ticketId);
        comment.setAuthorId(author.getId());
        comment.setAuthorName(author.getName());
        comment.setAuthorRole(author.getRole().name());
        comment.setContent(request.getContent());
        comment = commentRepository.save(comment);

        // Notify ticket owner (unless they are the commenter)
        if (!ticket.getUserId().equals(author.getId())) {
            notificationService.createNotification(
                    ticket.getUserId(),
                    "New Comment on Your Ticket",
                    author.getName() + " commented on your ticket: \"" + ticket.getTitle() + "\"",
                    "NEW_COMMENT",
                    ticketId
            );
        }

        return comment;
    }

    public List<Comment> getCommentsByTicket(String ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

    public Comment updateComment(String commentId, CommentRequest request, String userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        if (!comment.getAuthorId().equals(userId)) {
            throw new SecurityException("Only the author can edit this comment");
        }
        comment.setContent(request.getContent());
        comment.setEdited(true);
        comment.setUpdatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    public void deleteComment(String commentId, String userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        if (!comment.getAuthorId().equals(userId)) {
            throw new SecurityException("Only the author can delete this comment");
        }
        commentRepository.deleteById(commentId);
    }
}

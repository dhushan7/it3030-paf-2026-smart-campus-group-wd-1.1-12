package com.sliit.paf.smartcampus.service;

import com.sliit.paf.smartcampus.dto.TicketRequest;
import com.sliit.paf.smartcampus.dto.TicketStatusUpdateRequest;
import com.sliit.paf.smartcampus.enums.TicketStatus;
import com.sliit.paf.smartcampus.model.Ticket;
import com.sliit.paf.smartcampus.model.TicketAttachment;
import com.sliit.paf.smartcampus.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final NotificationService notificationService;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public TicketService(TicketRepository ticketRepository,
                         NotificationService notificationService) {
        this.ticketRepository = ticketRepository;
        this.notificationService = notificationService;
    }

    public Ticket createTicket(String userId, TicketRequest request,
                                List<MultipartFile> files) throws IOException {
        Ticket ticket = new Ticket();
        ticket.setUserId(userId);
        ticket.setTitle(request.getTitle());
        ticket.setResourceLocation(request.getResourceLocation());
        ticket.setCategory(request.getCategory());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setContactEmail(request.getContactEmail());
        ticket.setContactPhone(request.getContactPhone());
        ticket.setStatus(TicketStatus.OPEN);

        // Save first to get an ID for folder naming
        ticket = ticketRepository.save(ticket);

        if (files != null && !files.isEmpty()) {
            List<TicketAttachment> attachments = saveAttachments(ticket.getId(), files);
            ticket.setAttachments(attachments);
            ticket = ticketRepository.save(ticket);
        }

        return ticket;
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getTicketsByUser(String userId) {
        return ticketRepository.findByUserId(userId);
    }

    public List<Ticket> getTicketsByTechnician(String technicianId) {
        return ticketRepository.findByAssignedTechnicianId(technicianId);
    }

    public Ticket getTicketById(String ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + ticketId));
    }

    public Ticket updateTicketStatus(String ticketId, TicketStatusUpdateRequest request,
                                     String updaterUserId) {
        Ticket ticket = getTicketById(ticketId);
        TicketStatus newStatus = TicketStatus.valueOf(request.getStatus());
        TicketStatus oldStatus = ticket.getStatus();

        ticket.setStatus(newStatus);
        ticket.setUpdatedAt(LocalDateTime.now());

        if (request.getResolutionNotes() != null) {
            ticket.setResolutionNotes(request.getResolutionNotes());
        }
        if (request.getAssignedTechnicianId() != null) {
            ticket.setAssignedTechnicianId(request.getAssignedTechnicianId());
        }

        ticket = ticketRepository.save(ticket);

        // Notify ticket owner if status changed
        if (!oldStatus.equals(newStatus) && !ticket.getUserId().equals(updaterUserId)) {
            notificationService.createNotification(
                    ticket.getUserId(),
                    "Ticket Status Updated",
                    "Your ticket \"" + ticket.getTitle() + "\" status changed from "
                            + oldStatus + " to " + newStatus,
                    "TICKET_STATUS_CHANGE",
                    ticketId
            );
        }

        return ticket;
    }

    public void deleteTicket(String ticketId, String userId, boolean isAdmin) {
        Ticket ticket = getTicketById(ticketId);
        if (!isAdmin && !ticket.getUserId().equals(userId)) {
            throw new SecurityException("Access denied");
        }
        ticketRepository.deleteById(ticketId);
    }

    public long countByStatus(TicketStatus status) {
        return ticketRepository.countByStatus(status);
    }

    private List<TicketAttachment> saveAttachments(String ticketId,
                                                    List<MultipartFile> files) throws IOException {
        Path dir = Paths.get(uploadDir, "tickets", ticketId);
        Files.createDirectories(dir);

        List<TicketAttachment> attachments = new ArrayList<>();
        int limit = Math.min(files.size(), 3);

        for (int i = 0; i < limit; i++) {
            MultipartFile file = files.get(i);
            if (file.isEmpty()) continue;

            String ext = "";
            String original = file.getOriginalFilename();
            if (original != null && original.contains(".")) {
                ext = original.substring(original.lastIndexOf('.'));
            }
            String storedName = UUID.randomUUID() + ext;
            Path target = dir.resolve(storedName);
            Files.copy(file.getInputStream(), target);

            TicketAttachment attachment = new TicketAttachment();
            attachment.setFileName(storedName);
            attachment.setOriginalFileName(original);
            attachment.setFileType(file.getContentType());
            attachment.setFilePath("tickets/" + ticketId + "/" + storedName);
            attachment.setFileSize(file.getSize());
            attachments.add(attachment);
        }
        return attachments;
    }
}

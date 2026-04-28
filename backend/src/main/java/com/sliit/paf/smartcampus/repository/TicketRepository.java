package com.sliit.paf.smartcampus.repository;

import com.sliit.paf.smartcampus.enums.TicketStatus;
import com.sliit.paf.smartcampus.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByUserId(String userId);
    List<Ticket> findByAssignedTechnicianId(String technicianId);
    List<Ticket> findByStatus(TicketStatus status);
    long countByStatus(TicketStatus status);
}

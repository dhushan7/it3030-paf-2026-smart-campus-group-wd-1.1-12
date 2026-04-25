package com.sliit.paf.smartcampus.config;

import com.sliit.paf.smartcampus.enums.Role;
import com.sliit.paf.smartcampus.enums.TicketStatus;
import com.sliit.paf.smartcampus.model.Comment;
import com.sliit.paf.smartcampus.model.Notification;
import com.sliit.paf.smartcampus.model.Ticket;
import com.sliit.paf.smartcampus.model.User;
import com.sliit.paf.smartcampus.repository.CommentRepository;
import com.sliit.paf.smartcampus.repository.NotificationRepository;
import com.sliit.paf.smartcampus.repository.TicketRepository;
import com.sliit.paf.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Seeds the database with demo data.
 * Only active when the "seed" Spring profile is set.
 * Run once with:  .\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=seed
 *
 * Demo accounts
 * ─────────────────────────────────────────────────────────
 * Role        Email                         Password
 * ADMIN       admin@smartcampus.lk          Admin@123
 * TECHNICIAN  tech@smartcampus.lk           Tech@123
 * USER        student@smartcampus.lk        Student@123
 * ─────────────────────────────────────────────────────────
 */
@Profile("seed")
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository         userRepo;
    private final TicketRepository       ticketRepo;
    private final CommentRepository      commentRepo;
    private final NotificationRepository notificationRepo;
    private final PasswordEncoder        passwordEncoder;

    @Override
    public void run(String... args) {
        // Force-clear all collections so demo data is always clean
        System.out.println("[DataSeeder] Clearing existing data...");
        notificationRepo.deleteAll();
        commentRepo.deleteAll();
        ticketRepo.deleteAll();
        userRepo.deleteAll();
        System.out.println("[DataSeeder] Seeding demo data...");

        // ── 1. Users ────────────────────────────────────────────────────────
        User admin = new User();
        admin.setName("Admin User");
        admin.setEmail("admin@smartcampus.lk");
        admin.setPassword(passwordEncoder.encode("Admin@123"));
        admin.setRole(Role.ADMIN);
        admin.setPicture("https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff");
        admin.setCreatedAt(LocalDateTime.now().minusDays(30));
        admin = userRepo.save(admin);

        User technician = new User();
        technician.setName("Tech Perera");
        technician.setEmail("tech@smartcampus.lk");
        technician.setPassword(passwordEncoder.encode("Tech@123"));
        technician.setRole(Role.TECHNICIAN);
        technician.setPicture("https://ui-avatars.com/api/?name=Tech+Perera&background=0ea5e9&color=fff");
        technician.setCreatedAt(LocalDateTime.now().minusDays(25));
        technician = userRepo.save(technician);

        User student = new User();
        student.setName("Amasha Student");
        student.setEmail("student@smartcampus.lk");
        student.setPassword(passwordEncoder.encode("Student@123"));
        student.setRole(Role.USER);
        student.setPicture("https://ui-avatars.com/api/?name=Amasha+Student&background=a855f7&color=fff");
        student.setCreatedAt(LocalDateTime.now().minusDays(20));
        student = userRepo.save(student);

        // ── 2. Tickets ──────────────────────────────────────────────────────
        Ticket t1 = new Ticket();
        t1.setUserId(student.getId());
        t1.setTitle("Projector not working in Room 204");
        t1.setResourceLocation("Room 204, Block B");
        t1.setCategory("IT");
        t1.setDescription("The ceiling-mounted projector in Room 204 does not turn on. The power indicator light is off. Tried multiple power sockets — still no response. Lecture slides cannot be displayed, causing disruption to classes.");
        t1.setPriority("HIGH");
        t1.setContactEmail("student@smartcampus.lk");
        t1.setContactPhone("0771234567");
        t1.setStatus(TicketStatus.IN_PROGRESS);
        t1.setAssignedTechnicianId(technician.getId());
        t1.setCreatedAt(LocalDateTime.now().minusDays(5));
        t1.setUpdatedAt(LocalDateTime.now().minusDays(4));
        t1 = ticketRepo.save(t1);

        Ticket t2 = new Ticket();
        t2.setUserId(student.getId());
        t2.setTitle("Water leakage in Library (2nd floor)");
        t2.setResourceLocation("Main Library, 2nd Floor");
        t2.setCategory("FACILITIES");
        t2.setDescription("There is a water leak from the ceiling near the periodicals section on the 2nd floor of the main library. Water is dripping onto the reading desks and onto book shelves, risking damage to materials.");
        t2.setPriority("URGENT");
        t2.setContactEmail("student@smartcampus.lk");
        t2.setContactPhone("0771234567");
        t2.setStatus(TicketStatus.OPEN);
        t2.setCreatedAt(LocalDateTime.now().minusDays(3));
        t2.setUpdatedAt(LocalDateTime.now().minusDays(3));
        t2 = ticketRepo.save(t2);

        Ticket t3 = new Ticket();
        t3.setUserId(student.getId());
        t3.setTitle("Air conditioner not cooling — Lab 3");
        t3.setResourceLocation("Computer Lab 3, Block A");
        t3.setCategory("FACILITIES");
        t3.setDescription("The AC unit in Lab 3 runs but does not cool the room effectively. Temperature is very high during afternoon sessions, making it difficult to work. Several students have complained.");
        t3.setPriority("MEDIUM");
        t3.setContactEmail("student@smartcampus.lk");
        t3.setContactPhone("0771234567");
        t3.setStatus(TicketStatus.RESOLVED);
        t3.setAssignedTechnicianId(technician.getId());
        t3.setResolutionNotes("Refrigerant gas was recharged and the air filters were replaced. Unit is now functioning normally. Please report if the issue recurs.");
        t3.setCreatedAt(LocalDateTime.now().minusDays(12));
        t3.setUpdatedAt(LocalDateTime.now().minusDays(1));
        t3 = ticketRepo.save(t3);

        Ticket t4 = new Ticket();
        t4.setUserId(student.getId());
        t4.setTitle("Faulty electrical socket — Cafeteria");
        t4.setResourceLocation("Student Cafeteria, Ground Floor");
        t4.setCategory("HEALTH_SAFETY");
        t4.setDescription("One of the power sockets near the vending machines in the cafeteria is sparking when devices are plugged in. This poses a serious safety risk and should be addressed urgently.");
        t4.setPriority("URGENT");
        t4.setContactEmail("student@smartcampus.lk");
        t4.setContactPhone("0771234567");
        t4.setStatus(TicketStatus.CLOSED);
        t4.setAssignedTechnicianId(technician.getId());
        t4.setResolutionNotes("The faulty socket has been replaced and the wiring inspected by a certified electrician. Area is safe to use.");
        t4.setCreatedAt(LocalDateTime.now().minusDays(20));
        t4.setUpdatedAt(LocalDateTime.now().minusDays(15));
        t4 = ticketRepo.save(t4);

        Ticket t5 = new Ticket();
        t5.setUserId(student.getId());
        t5.setTitle("Wi-Fi outage in Block C student lounge");
        t5.setResourceLocation("Student Lounge, Block C");
        t5.setCategory("IT");
        t5.setDescription("The Wi-Fi access point in the Block C student lounge has been down for 3 days. Students cannot access the internet for assignments and online resources.");
        t5.setPriority("MEDIUM");
        t5.setContactEmail("student@smartcampus.lk");
        t5.setContactPhone("0771234567");
        t5.setStatus(TicketStatus.OPEN);
        t5.setCreatedAt(LocalDateTime.now().minusDays(2));
        t5.setUpdatedAt(LocalDateTime.now().minusDays(2));
        t5 = ticketRepo.save(t5);

        Ticket t6 = new Ticket();
        t6.setUserId(student.getId());
        t6.setTitle("Broken window lock — Room 108");
        t6.setResourceLocation("Room 108, Block D");
        t6.setCategory("SECURITY");
        t6.setDescription("The window lock mechanism in Room 108 is broken, leaving the window permanently open. This is a security concern, especially during evenings. Rain also enters the room.");
        t6.setPriority("LOW");
        t6.setContactEmail("student@smartcampus.lk");
        t6.setContactPhone("0771234567");
        t6.setStatus(TicketStatus.REJECTED);
        t6.setResolutionNotes("This falls under scheduled maintenance rather than emergency repairs. It has been forwarded to the facilities team for the next maintenance cycle.");
        t6.setCreatedAt(LocalDateTime.now().minusDays(10));
        t6.setUpdatedAt(LocalDateTime.now().minusDays(8));
        t6 = ticketRepo.save(t6);

        // ── 3. Comments ─────────────────────────────────────────────────────
        Comment c1 = new Comment();
        c1.setTicketId(t1.getId());
        c1.setAuthorId(technician.getId());
        c1.setAuthorName(technician.getName());
        c1.setAuthorRole("TECHNICIAN");
        c1.setContent("I have inspected the unit. The internal power supply board appears to be faulty. I've ordered a replacement — expected to arrive in 2 working days.");
        c1.setCreatedAt(LocalDateTime.now().minusDays(4));
        c1.setUpdatedAt(LocalDateTime.now().minusDays(4));
        commentRepo.save(c1);

        Comment c2 = new Comment();
        c2.setTicketId(t1.getId());
        c2.setAuthorId(student.getId());
        c2.setAuthorName(student.getName());
        c2.setAuthorRole("USER");
        c2.setContent("Thank you for the update! The lecturer has temporarily moved to Room 206 in the meantime. Please let us know once it's fixed.");
        c2.setCreatedAt(LocalDateTime.now().minusDays(3));
        c2.setUpdatedAt(LocalDateTime.now().minusDays(3));
        commentRepo.save(c2);

        Comment c3 = new Comment();
        c3.setTicketId(t2.getId());
        c3.setAuthorId(admin.getId());
        c3.setAuthorName(admin.getName());
        c3.setAuthorRole("ADMIN");
        c3.setContent("This has been escalated to the facilities management team. A plumber will assess the situation tomorrow morning. The affected bookshelves have been covered in the meantime.");
        c3.setCreatedAt(LocalDateTime.now().minusDays(2));
        c3.setUpdatedAt(LocalDateTime.now().minusDays(2));
        commentRepo.save(c3);

        Comment c4 = new Comment();
        c4.setTicketId(t3.getId());
        c4.setAuthorId(technician.getId());
        c4.setAuthorName(technician.getName());
        c4.setAuthorRole("TECHNICIAN");
        c4.setContent("Repair complete. The AC unit has been serviced and is now working correctly. Please confirm if the cooling is satisfactory.");
        c4.setCreatedAt(LocalDateTime.now().minusDays(1));
        c4.setUpdatedAt(LocalDateTime.now().minusDays(1));
        commentRepo.save(c4);

        // ── 4. Notifications ────────────────────────────────────────────────
        Notification n1 = new Notification();
        n1.setUserId(student.getId());
        n1.setTitle("Ticket Status Updated");
        n1.setMessage("Your ticket \"Projector not working in Room 204\" is now IN PROGRESS.");
        n1.setType("TICKET_STATUS_CHANGE");
        n1.setRelatedId(t1.getId());
        n1.setRead(false);
        n1.setCreatedAt(LocalDateTime.now().minusDays(4));
        notificationRepo.save(n1);

        Notification n2 = new Notification();
        n2.setUserId(student.getId());
        n2.setTitle("New Comment on Your Ticket");
        n2.setMessage("Tech Perera commented on \"Projector not working in Room 204\".");
        n2.setType("NEW_COMMENT");
        n2.setRelatedId(t1.getId());
        n2.setRead(true);
        n2.setCreatedAt(LocalDateTime.now().minusDays(4));
        notificationRepo.save(n2);

        Notification n3 = new Notification();
        n3.setUserId(student.getId());
        n3.setTitle("Ticket Resolved");
        n3.setMessage("Your ticket \"Air conditioner not cooling — Lab 3\" has been RESOLVED.");
        n3.setType("TICKET_STATUS_CHANGE");
        n3.setRelatedId(t3.getId());
        n3.setRead(false);
        n3.setCreatedAt(LocalDateTime.now().minusDays(1));
        notificationRepo.save(n3);

        Notification n4 = new Notification();
        n4.setUserId(student.getId());
        n4.setTitle("New Comment on Your Ticket");
        n4.setMessage("Admin User commented on \"Water leakage in Library (2nd floor)\".");
        n4.setType("NEW_COMMENT");
        n4.setRelatedId(t2.getId());
        n4.setRead(false);
        n4.setCreatedAt(LocalDateTime.now().minusDays(2));
        notificationRepo.save(n4);

        Notification n5 = new Notification();
        n5.setUserId(technician.getId());
        n5.setTitle("Ticket Assigned to You");
        n5.setMessage("You have been assigned to ticket \"Projector not working in Room 204\".");
        n5.setType("TICKET_STATUS_CHANGE");
        n5.setRelatedId(t1.getId());
        n5.setRead(true);
        n5.setCreatedAt(LocalDateTime.now().minusDays(4));
        notificationRepo.save(n5);

        System.out.println("[DataSeeder] ✓ Seeded 3 users, 6 tickets, 4 comments, 5 notifications.");
        System.out.println("[DataSeeder] ─────────────────────────────────────────────────");
        System.out.println("[DataSeeder] ADMIN       → admin@smartcampus.lk   / Admin@123");
        System.out.println("[DataSeeder] TECHNICIAN  → tech@smartcampus.lk    / Tech@123");
        System.out.println("[DataSeeder] USER        → student@smartcampus.lk / Student@123");
        System.out.println("[DataSeeder] ─────────────────────────────────────────────────");
    }
}

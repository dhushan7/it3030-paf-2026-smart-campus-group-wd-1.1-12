package com.sliit.paf.smartcampus.controller;

import com.sliit.paf.smartcampus.model.Resource;
import com.sliit.paf.smartcampus.service.ResourceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/resources")
@CrossOrigin(origins = "http://localhost:5173")
public class ResourceController {

    private final ResourceService service;

    public ResourceController(ResourceService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Resource> createResource(@Valid @RequestBody Resource resource) {
        return new ResponseEntity<>(service.createResource(resource), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Resource>> getResources(@RequestParam(required = false) String type) {
        if (type != null && !type.isEmpty()) {
            return ResponseEntity.ok(service.filterResources(type));
        }
        return ResponseEntity.ok(service.getAllResources());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(@PathVariable String id, @Valid @RequestBody Resource resource) {
        return ResponseEntity.ok(service.updateResource(id, resource));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Resource> updateStatus(
            @PathVariable String id,
            @RequestParam String status) {

        return ResponseEntity.ok(service.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        service.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}
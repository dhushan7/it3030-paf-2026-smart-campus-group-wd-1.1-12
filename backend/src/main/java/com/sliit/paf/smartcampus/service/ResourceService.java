package com.sliit.paf.smartcampus.service;

import com.sliit.paf.smartcampus.model.Resource;
import com.sliit.paf.smartcampus.repository.ResourceRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository repository;

    public ResourceService(ResourceRepository repository) {
        this.repository = repository;
    }

    public Resource createResource(Resource resource) {
        return repository.save(resource);
    }

    public List<Resource> getAllResources() {
        return repository.findAll();
    }

    public List<Resource> filterResources(String type) {
        return repository.findByTypeContainingIgnoreCase(type);
    }

    public Resource updateResource(String id, Resource updatedResource) {
        return repository.findById(id).map(resource -> {
            resource.setName(updatedResource.getName());
            resource.setType(updatedResource.getType());
            resource.setCapacity(updatedResource.getCapacity());
            resource.setLocation(updatedResource.getLocation());
            resource.setAvailabilityWindow(updatedResource.getAvailabilityWindow());
            resource.setStatus(updatedResource.getStatus());
            return repository.save(resource);
        }).orElseThrow(() -> new RuntimeException("Resource not found"));
    }

    public void deleteResource(String id) {
        repository.deleteById(id);
    }
}
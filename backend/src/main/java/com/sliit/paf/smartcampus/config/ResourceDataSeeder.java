package com.sliit.paf.smartcampus.config;

import com.sliit.paf.smartcampus.model.Resource;
import com.sliit.paf.smartcampus.repository.ResourceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Configuration
public class ResourceDataSeeder {
    private static final Logger log = LoggerFactory.getLogger(ResourceDataSeeder.class);

    private static final String DEFAULT_AVAILABILITY_WINDOW = "Daily 08:00-18:00";
    private static final String DEFAULT_LOCATION = "Main Campus";

    @Bean
    CommandLineRunner seedResources(ResourceRepository resourceRepository) {
        return args -> {
            try {
                List<Resource> existingResources = resourceRepository.findAll();
                normalizeExistingResources(existingResources, resourceRepository);

                List<Resource> defaultResources = List.of(
                        createResource("Conference Hall 1", "LECTURE_HALL", 120, "Main Building - Floor 1", "Weekdays 08:00-17:00"),
                        createResource("Business Seminar Hall", "LECTURE_HALL", 80, "Business Faculty - Floor 2", "Weekdays 09:00-18:00"),
                        createResource("Innovation Hub Room", "MEETING_ROOM", 20, "Innovation Center", "Daily 08:00-20:00"),
                        createResource("Project Discussion Room", "MEETING_ROOM", 12, "Library Annex", "Daily 08:00-18:00"),
                        createResource("Computer Lab A", "LABORATORY", 40, "Computing Building - Lab Wing", "Weekdays 08:00-17:00"),
                        createResource("Multimedia Equipment Kit", "EQUIPMENT", 5, "Equipment Store", "Weekdays 09:00-16:00")
                );

                Set<String> existingNames = existingResources.stream()
                        .map(Resource::getName)
                        .filter(Objects::nonNull)
                        .map(name -> name.trim().toLowerCase(Locale.ROOT))
                        .collect(Collectors.toSet());

                List<Resource> missingResources = new ArrayList<>();
                for (Resource resource : defaultResources) {
                    String normalizedName = resource.getName().trim().toLowerCase(Locale.ROOT);
                    if (!existingNames.contains(normalizedName)) {
                        missingResources.add(resource);
                    }
                }

                if (!missingResources.isEmpty()) {
                    resourceRepository.saveAll(missingResources);
                }
            } catch (Exception ex) {
                log.warn("Resource seeding skipped due to database connectivity issue: {}", ex.getMessage());
            }
        };
    }

    private Resource createResource(String name, String type, int capacity, String location, String availabilityWindow) {
        Resource resource = new Resource();
        resource.setName(name);
        resource.setType(type);
        resource.setCapacity(capacity);
        resource.setLocation(location);
        resource.setAvailabilityWindow(availabilityWindow);
        resource.setStatus("ACTIVE");
        return resource;
    }

    private void normalizeExistingResources(List<Resource> existingResources, ResourceRepository resourceRepository) {
        if (existingResources.isEmpty()) {
            return;
        }

        Map<String, Integer> typeCapacityDefaults = Map.of(
                "LECTURE_HALL", 80,
                "MEETING_ROOM", 20,
                "LABORATORY", 30,
                "EQUIPMENT", 1
        );

        List<Resource> repairedResources = existingResources.stream()
                .map(resource -> {
                    boolean changed = false;

                    if (isBlank(resource.getName())) {
                        resource.setName("Resource " + (resource.getId() != null ? resource.getId() : "Unknown"));
                        changed = true;
                    } else {
                        String normalizedName = resource.getName().trim();
                        if (!normalizedName.equals(resource.getName())) {
                            resource.setName(normalizedName);
                            changed = true;
                        }
                    }

                    String normalizedType = normalizeType(resource.getType(), resource.getName());
                    if (!normalizedType.equals(resource.getType())) {
                        resource.setType(normalizedType);
                        changed = true;
                    }

                    if (resource.getCapacity() == null || resource.getCapacity() < 1) {
                        resource.setCapacity(typeCapacityDefaults.getOrDefault(normalizedType, 10));
                        changed = true;
                    }

                    if (isBlank(resource.getLocation())) {
                        resource.setLocation(DEFAULT_LOCATION);
                        changed = true;
                    } else {
                        String normalizedLocation = resource.getLocation().trim();
                        if (!normalizedLocation.equals(resource.getLocation())) {
                            resource.setLocation(normalizedLocation);
                            changed = true;
                        }
                    }

                    if (isBlank(resource.getAvailabilityWindow())) {
                        resource.setAvailabilityWindow(DEFAULT_AVAILABILITY_WINDOW);
                        changed = true;
                    }

                    if (isBlank(resource.getStatus())) {
                        resource.setStatus("ACTIVE");
                        changed = true;
                    } else {
                        String normalizedStatus = resource.getStatus().trim().toUpperCase(Locale.ROOT);
                        if (!normalizedStatus.equals(resource.getStatus())) {
                            resource.setStatus(normalizedStatus);
                            changed = true;
                        }
                    }

                    return changed ? resource : null;
                })
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing(Resource::getName))
                .toList();

        if (!repairedResources.isEmpty()) {
            resourceRepository.saveAll(repairedResources);
        }
    }

    private String normalizeType(String currentType, String resourceName) {
        if (!isBlank(currentType)) {
            return currentType.trim().toUpperCase(Locale.ROOT).replace(" ", "_");
        }

        String normalizedName = resourceName == null ? "" : resourceName.toLowerCase(Locale.ROOT);
        if (normalizedName.contains("lab")) {
            return "LABORATORY";
        }
        if (normalizedName.contains("equipment") || normalizedName.contains("kit")) {
            return "EQUIPMENT";
        }
        if (normalizedName.contains("meeting") || normalizedName.contains("discussion")) {
            return "MEETING_ROOM";
        }
        return "LECTURE_HALL";
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}

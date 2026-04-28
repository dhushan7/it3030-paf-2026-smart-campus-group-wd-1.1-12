package com.sliit.paf.smartcampus.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

@Document(collection = "resource")
public class Resource {

    @Id
    private String id;

    @NotBlank(message = "Resource name is required")
    private String name;

    @NotBlank(message = "Type is required (e.g., LECTURE_HALL, EQUIPMENT)")
    private String type;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @NotBlank(message = "Location is required")
    private String location;

    private String availabilityStart;
    private String availabilityEnd;

    private String status = "ACTIVE";


    public String getId() {return id;}
    public void setId(String id) {this.id = id;}

    public String getName() {return name;}
    public void setName(String name) {this.name = name;}

    public String getType() {return type;}
    public void setType(String type) {this.type = type;}

    public Integer getCapacity() {return capacity;}
    public void setCapacity(Integer capacity) {this.capacity = capacity;}

    public String getLocation() {return location;}
    public void setLocation(String location) {this.location = location;}

    public String getAvailabilityStart() {return availabilityStart;}
    public void setAvailabilityStart(String availabilityStart) {this.availabilityStart = availabilityStart;}

    public String getAvailabilityEnd() {return availabilityEnd;}
    public void setAvailabilityEnd(String availabilityEnd) {this.availabilityEnd = availabilityEnd;}

    public String getStatus() {return status;}
    public void setStatus(String status) {this.status = status;}
}
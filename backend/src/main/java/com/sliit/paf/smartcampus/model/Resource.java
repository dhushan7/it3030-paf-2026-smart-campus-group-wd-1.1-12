package com.sliit.paf.smartcampus.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

@Entity
@Table(name = "resources")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Resource name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Type is required (e.g., LECTURE_HALL, EQUIPMENT)")
    @Column(nullable = false)
    private String type;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    @Column(nullable = false)
    private Integer capacity;

    @NotBlank(message = "Location is required")
    @Column(nullable = false)
    private String location;

    @Column(name = "availability_window")
    private String availabilityWindow;

    @Column(nullable = false)
    private String status = "ACTIVE";

    public Long getId() {return id;}
    public void setId(Long id) {this.id = id;}

    public String getName() {return name;}
    public void setName(String name) {this.name = name;}

    public String getType() {return type;}
    public void setType(String type) {this.type = type;}

    public Integer getCapacity() {return capacity;}
    public void setCapacity(Integer capacity) {this.capacity = capacity;}

    public String getLocation() {return location;}
    public void setLocation(String location) {this.location = location;}

    public String getAvailabilityWindow() {return availabilityWindow;}
    public void setAvailabilityWindow(String availabilityWindow) {this.availabilityWindow = availabilityWindow;}

    public String getStatus() {return status;}
    public void setStatus(String status) {this.status = status;}

}
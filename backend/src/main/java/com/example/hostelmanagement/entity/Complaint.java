package com.example.hostelmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false)
    private String complaintType; // e.g. Electrical, Plumbing, Cleanliness, WiFi, Carpentry, Other

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private LocalDate complaintDate;

    @Column(nullable = false)
    private String status = "Pending"; // "Pending", "In Progress", "Resolved"

    public Complaint() {
    }

    public Complaint(Long id, Student student, String complaintType, String description, LocalDate complaintDate, String status) {
        this.id = id;
        this.student = student;
        this.complaintType = complaintType;
        this.description = description;
        this.complaintDate = complaintDate;
        this.status = status != null ? status : "Pending";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public String getComplaintType() {
        return complaintType;
    }

    public void setComplaintType(String complaintType) {
        this.complaintType = complaintType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getComplaintDate() {
        return complaintDate;
    }

    public void setComplaintDate(LocalDate complaintDate) {
        this.complaintDate = complaintDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

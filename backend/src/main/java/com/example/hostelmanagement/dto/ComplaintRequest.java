package com.example.hostelmanagement.dto;

import java.time.LocalDate;

public class ComplaintRequest {

    private Long studentId;
    private String complaintType;
    private String description;
    private LocalDate complaintDate;
    private String status;

    public ComplaintRequest() {
    }

    public ComplaintRequest(Long studentId, String complaintType, String description, LocalDate complaintDate, String status) {
        this.studentId = studentId;
        this.complaintType = complaintType;
        this.description = description;
        this.complaintDate = complaintDate;
        this.status = status;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
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

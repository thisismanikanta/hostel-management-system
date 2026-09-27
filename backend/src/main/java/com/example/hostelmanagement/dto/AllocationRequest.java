package com.example.hostelmanagement.dto;

import java.time.LocalDate;

public class AllocationRequest {

    private Long studentId;
    private Long roomId;
    private LocalDate allocationDate;

    public AllocationRequest() {
    }

    public AllocationRequest(Long studentId, Long roomId, LocalDate allocationDate) {
        this.studentId = studentId;
        this.roomId = roomId;
        this.allocationDate = allocationDate;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public LocalDate getAllocationDate() {
        return allocationDate;
    }

    public void setAllocationDate(LocalDate allocationDate) {
        this.allocationDate = allocationDate;
    }
}

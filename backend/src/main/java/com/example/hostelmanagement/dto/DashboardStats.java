package com.example.hostelmanagement.dto;

public class DashboardStats {

    private long totalStudents;
    private long totalHostels;
    private long totalRooms;
    private long occupiedRooms;
    private long availableRooms;
    private long pendingComplaints;

    public DashboardStats() {
    }

    public DashboardStats(long totalStudents, long totalHostels, long totalRooms, long occupiedRooms, long availableRooms, long pendingComplaints) {
        this.totalStudents = totalStudents;
        this.totalHostels = totalHostels;
        this.totalRooms = totalRooms;
        this.occupiedRooms = occupiedRooms;
        this.availableRooms = availableRooms;
        this.pendingComplaints = pendingComplaints;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalHostels() {
        return totalHostels;
    }

    public void setTotalHostels(long totalHostels) {
        this.totalHostels = totalHostels;
    }

    public long getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(long totalRooms) {
        this.totalRooms = totalRooms;
    }

    public long getOccupiedRooms() {
        return occupiedRooms;
    }

    public void setOccupiedRooms(long occupiedRooms) {
        this.occupiedRooms = occupiedRooms;
    }

    public long getAvailableRooms() {
        return availableRooms;
    }

    public void setAvailableRooms(long availableRooms) {
        this.availableRooms = availableRooms;
    }

    public long getPendingComplaints() {
        return pendingComplaints;
    }

    public void setPendingComplaints(long pendingComplaints) {
        this.pendingComplaints = pendingComplaints;
    }
}

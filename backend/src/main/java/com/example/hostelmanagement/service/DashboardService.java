package com.example.hostelmanagement.service;

import com.example.hostelmanagement.dto.DashboardStats;
import com.example.hostelmanagement.repository.ComplaintRepository;
import com.example.hostelmanagement.repository.HostelRepository;
import com.example.hostelmanagement.repository.RoomRepository;
import com.example.hostelmanagement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private HostelRepository hostelRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    // Get aggregated statistics for the dashboard
    public DashboardStats getStats() {
        long totalStudents = studentRepository.count();
        long totalHostels = hostelRepository.count();
        long totalRooms = roomRepository.count();
        long occupiedRooms = roomRepository.countByOccupiedBedsGreaterThan(0);
        long availableRooms = roomRepository.countByStatus("Available");
        long pendingComplaints = complaintRepository.countByStatusIgnoreCase("Pending");

        return new DashboardStats(
                totalStudents,
                totalHostels,
                totalRooms,
                occupiedRooms,
                availableRooms,
                pendingComplaints
        );
    }
}

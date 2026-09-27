package com.example.hostelmanagement.service;

import com.example.hostelmanagement.dto.ComplaintRequest;
import com.example.hostelmanagement.entity.Complaint;
import com.example.hostelmanagement.entity.Student;
import com.example.hostelmanagement.repository.ComplaintRepository;
import com.example.hostelmanagement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private StudentRepository studentRepository;

    // Retrieve all complaints
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAllByOrderByIdDesc();
    }

    // Retrieve complaint by ID
    public Optional<Complaint> getComplaintById(Long id) {
        return complaintRepository.findById(id);
    }

    // Save a new complaint
    public Complaint saveComplaint(ComplaintRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + request.getStudentId()));

        Complaint complaint = new Complaint();
        complaint.setStudent(student);
        complaint.setComplaintType(request.getComplaintType());
        complaint.setDescription(request.getDescription());
        complaint.setComplaintDate(request.getComplaintDate() != null ? request.getComplaintDate() : LocalDate.now());
        complaint.setStatus(request.getStatus() != null ? request.getStatus() : "Pending");

        return complaintRepository.save(complaint);
    }

    // Update complaint status (Pending, In Progress, Resolved)
    public Complaint updateComplaintStatus(Long id, String status) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + id));

        complaint.setStatus(status);
        return complaintRepository.save(complaint);
    }

    // Update entire complaint
    public Complaint updateComplaint(Long id, ComplaintRequest request) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + id));

        if (request.getStudentId() != null) {
            Student student = studentRepository.findById(request.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found with id: " + request.getStudentId()));
            complaint.setStudent(student);
        }

        complaint.setComplaintType(request.getComplaintType());
        complaint.setDescription(request.getDescription());
        if (request.getComplaintDate() != null) {
            complaint.setComplaintDate(request.getComplaintDate());
        }
        if (request.getStatus() != null) {
            complaint.setStatus(request.getStatus());
        }

        return complaintRepository.save(complaint);
    }

    // Delete a complaint
    public void deleteComplaint(Long id) {
        if (!complaintRepository.existsById(id)) {
            throw new RuntimeException("Complaint not found with id: " + id);
        }
        complaintRepository.deleteById(id);
    }
}

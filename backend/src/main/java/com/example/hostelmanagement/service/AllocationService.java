package com.example.hostelmanagement.service;

import com.example.hostelmanagement.dto.AllocationRequest;
import com.example.hostelmanagement.entity.Allocation;
import com.example.hostelmanagement.entity.Room;
import com.example.hostelmanagement.entity.Student;
import com.example.hostelmanagement.repository.AllocationRepository;
import com.example.hostelmanagement.repository.RoomRepository;
import com.example.hostelmanagement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AllocationService {

    @Autowired
    private AllocationRepository allocationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private RoomRepository roomRepository;

    // Get all allocations (newest first)
    public List<Allocation> getAllAllocations() {
        return allocationRepository.findAllByOrderByIdDesc();
    }

    // Get allocation by ID
    public Optional<Allocation> getAllocationById(Long id) {
        return allocationRepository.findById(id);
    }

    // Allocate a student to a room
    @Transactional
    public Allocation allocateStudent(AllocationRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + request.getStudentId()));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + request.getRoomId()));

        // Prevent duplicate active allocation for the same student
        Optional<Allocation> activeAlloc = allocationRepository.findByStudentIdAndStatus(student.getId(), "Active");
        if (activeAlloc.isPresent()) {
            throw new RuntimeException("Student " + student.getName() + " is already allocated to Room "
                    + activeAlloc.get().getRoom().getRoomNumber() + " (" + activeAlloc.get().getRoom().getHostel().getName() + ")!");
        }

        // Prevent allocation when the room is full
        if (room.getOccupiedBeds() >= room.getCapacity()) {
            throw new RuntimeException("Cannot allocate: Room " + room.getRoomNumber() + " is already full!");
        }

        // Increase occupied beds and update status
        room.setOccupiedBeds(room.getOccupiedBeds() + 1);
        if (room.getOccupiedBeds() >= room.getCapacity()) {
            room.setStatus("Full");
        }
        roomRepository.save(room);

        // Create new allocation
        Allocation allocation = new Allocation();
        allocation.setStudent(student);
        allocation.setRoom(room);
        allocation.setAllocationDate(request.getAllocationDate() != null ? request.getAllocationDate() : LocalDate.now());
        allocation.setStatus("Active");

        return allocationRepository.save(allocation);
    }

    // Vacate a student from their allocated room
    @Transactional
    public Allocation vacateStudent(Long allocationId) {
        Allocation allocation = allocationRepository.findById(allocationId)
                .orElseThrow(() -> new RuntimeException("Allocation not found with id: " + allocationId));

        if ("Vacated".equalsIgnoreCase(allocation.getStatus())) {
            throw new RuntimeException("Student is already vacated from this room!");
        }

        allocation.setStatus("Vacated");
        allocation.setVacateDate(LocalDate.now());

        // Decrease room occupied beds
        Room room = allocation.getRoom();
        if (room != null) {
            int newOccupied = Math.max(0, room.getOccupiedBeds() - 1);
            room.setOccupiedBeds(newOccupied);
            room.setStatus("Available");
            roomRepository.save(room);
        }

        return allocationRepository.save(allocation);
    }

    // Delete allocation record
    @Transactional
    public void deleteAllocation(Long id) {
        Allocation allocation = allocationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Allocation not found with id: " + id));

        // If deleting an active allocation, adjust room occupancy
        if ("Active".equalsIgnoreCase(allocation.getStatus())) {
            Room room = allocation.getRoom();
            if (room != null) {
                int newOccupied = Math.max(0, room.getOccupiedBeds() - 1);
                room.setOccupiedBeds(newOccupied);
                room.setStatus("Available");
                roomRepository.save(room);
            }
        }

        allocationRepository.delete(allocation);
    }
}

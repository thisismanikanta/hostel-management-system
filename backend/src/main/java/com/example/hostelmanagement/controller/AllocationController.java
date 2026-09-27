package com.example.hostelmanagement.controller;

import com.example.hostelmanagement.dto.AllocationRequest;
import com.example.hostelmanagement.entity.Allocation;
import com.example.hostelmanagement.service.AllocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/allocations")
@CrossOrigin(origins = "*")
public class AllocationController {

    @Autowired
    private AllocationService allocationService;

    // Get all room allocations
    @GetMapping
    public ResponseEntity<List<Allocation>> getAllAllocations() {
        List<Allocation> allocations = allocationService.getAllAllocations();
        return ResponseEntity.ok(allocations);
    }

    // Get allocation by ID
    @GetMapping("/{id}")
    public ResponseEntity<Allocation> getAllocationById(@PathVariable Long id) {
        return allocationService.getAllocationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Allocate a student to a room
    @PostMapping
    public ResponseEntity<?> allocateStudent(@RequestBody AllocationRequest request) {
        try {
            Allocation created = allocationService.allocateStudent(request);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Vacate student from room
    @PutMapping("/{id}/vacate")
    public ResponseEntity<?> vacateStudent(@PathVariable Long id) {
        try {
            Allocation vacated = allocationService.vacateStudent(id);
            return ResponseEntity.ok(vacated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete an allocation record
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAllocation(@PathVariable Long id) {
        try {
            allocationService.deleteAllocation(id);
            return ResponseEntity.ok("Allocation deleted successfully with id: " + id);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}

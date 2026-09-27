package com.example.hostelmanagement.controller;

import com.example.hostelmanagement.entity.Hostel;
import com.example.hostelmanagement.service.HostelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hostels")
@CrossOrigin(origins = "*")
public class HostelController {

    @Autowired
    private HostelService hostelService;

    // Get all hostels
    @GetMapping
    public ResponseEntity<List<Hostel>> getAllHostels() {
        List<Hostel> hostels = hostelService.getAllHostels();
        return ResponseEntity.ok(hostels);
    }

    // Get hostel by ID
    @GetMapping("/{id}")
    public ResponseEntity<Hostel> getHostelById(@PathVariable Long id) {
        return hostelService.getHostelById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Add a new hostel
    @PostMapping
    public ResponseEntity<Hostel> createHostel(@RequestBody Hostel hostel) {
        Hostel created = hostelService.saveHostel(hostel);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Update an existing hostel
    @PutMapping("/{id}")
    public ResponseEntity<Hostel> updateHostel(@PathVariable Long id, @RequestBody Hostel hostel) {
        try {
            Hostel updated = hostelService.updateHostel(id, hostel);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a hostel
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHostel(@PathVariable Long id) {
        try {
            hostelService.deleteHostel(id);
            return ResponseEntity.ok("Hostel deleted successfully with id: " + id);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}

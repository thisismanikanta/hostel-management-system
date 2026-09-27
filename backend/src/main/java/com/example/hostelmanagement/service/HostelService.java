package com.example.hostelmanagement.service;

import com.example.hostelmanagement.entity.Hostel;
import com.example.hostelmanagement.repository.HostelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HostelService {

    @Autowired
    private HostelRepository hostelRepository;

    // Retrieve all hostels
    public List<Hostel> getAllHostels() {
        return hostelRepository.findAll();
    }

    // Retrieve hostel by ID
    public Optional<Hostel> getHostelById(Long id) {
        return hostelRepository.findById(id);
    }

    // Save new hostel
    public Hostel saveHostel(Hostel hostel) {
        return hostelRepository.save(hostel);
    }

    // Update existing hostel
    public Hostel updateHostel(Long id, Hostel updatedHostel) {
        Hostel hostel = hostelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hostel not found with id: " + id));

        hostel.setName(updatedHostel.getName());
        hostel.setType(updatedHostel.getType());
        hostel.setTotalFloors(updatedHostel.getTotalFloors());
        hostel.setAddress(updatedHostel.getAddress());

        return hostelRepository.save(hostel);
    }

    // Delete hostel by ID
    public void deleteHostel(Long id) {
        if (!hostelRepository.existsById(id)) {
            throw new RuntimeException("Hostel not found with id: " + id);
        }
        hostelRepository.deleteById(id);
    }
}

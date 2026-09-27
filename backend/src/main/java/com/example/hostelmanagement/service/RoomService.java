package com.example.hostelmanagement.service;

import com.example.hostelmanagement.dto.RoomRequest;
import com.example.hostelmanagement.entity.Hostel;
import com.example.hostelmanagement.entity.Room;
import com.example.hostelmanagement.repository.HostelRepository;
import com.example.hostelmanagement.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private HostelRepository hostelRepository;

    // Retrieve all rooms
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    // Retrieve room by ID
    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }

    // Save a new room
    public Room saveRoom(RoomRequest request) {
        Hostel hostel = hostelRepository.findById(request.getHostelId())
                .orElseThrow(() -> new RuntimeException("Hostel not found with id: " + request.getHostelId()));

        Room room = new Room();
        room.setRoomNumber(request.getRoomNumber());
        room.setHostel(hostel);
        room.setFloor(request.getFloor());
        room.setRoomType(request.getRoomType());
        room.setCapacity(request.getCapacity());
        int occupied = (request.getOccupiedBeds() != null) ? request.getOccupiedBeds() : 0;
        room.setOccupiedBeds(occupied);
        room.setStatus(occupied >= request.getCapacity() ? "Full" : "Available");

        return roomRepository.save(room);
    }

    // Update an existing room
    public Room updateRoom(Long id, RoomRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));

        if (request.getHostelId() != null) {
            Hostel hostel = hostelRepository.findById(request.getHostelId())
                    .orElseThrow(() -> new RuntimeException("Hostel not found with id: " + request.getHostelId()));
            room.setHostel(hostel);
        }

        room.setRoomNumber(request.getRoomNumber());
        room.setFloor(request.getFloor());
        room.setRoomType(request.getRoomType());
        room.setCapacity(request.getCapacity());

        if (request.getOccupiedBeds() != null) {
            room.setOccupiedBeds(request.getOccupiedBeds());
        }

        // Update status based on capacity
        if (room.getOccupiedBeds() >= room.getCapacity()) {
            room.setStatus("Full");
        } else {
            room.setStatus(request.getStatus() != null ? request.getStatus() : "Available");
        }

        return roomRepository.save(room);
    }

    // Delete a room
    public void deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new RuntimeException("Room not found with id: " + id);
        }
        roomRepository.deleteById(id);
    }
}

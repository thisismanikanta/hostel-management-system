package com.example.hostelmanagement.repository;

import com.example.hostelmanagement.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByHostelId(Long hostelId);

    long countByStatus(String status);

    long countByOccupiedBedsGreaterThan(Integer count);
}

package com.example.hostelmanagement.repository;

import com.example.hostelmanagement.entity.Allocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AllocationRepository extends JpaRepository<Allocation, Long> {

    List<Allocation> findAllByOrderByIdDesc();

    List<Allocation> findByStatus(String status);

    Optional<Allocation> findByStudentIdAndStatus(Long studentId, String status);

    List<Allocation> findByRoomId(Long roomId);
}

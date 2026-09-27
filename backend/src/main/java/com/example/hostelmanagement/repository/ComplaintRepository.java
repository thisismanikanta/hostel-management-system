package com.example.hostelmanagement.repository;

import com.example.hostelmanagement.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    List<Complaint> findAllByOrderByIdDesc();

    List<Complaint> findByStatus(String status);

    long countByStatusIgnoreCase(String status);
}

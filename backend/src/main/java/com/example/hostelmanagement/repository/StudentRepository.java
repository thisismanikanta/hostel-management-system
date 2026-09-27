package com.example.hostelmanagement.repository;

import com.example.hostelmanagement.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    // Custom query method for searching students by name, course, or email
    List<Student> findByNameContainingIgnoreCaseOrCourseContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String name, String course, String email
    );
}

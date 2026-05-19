package com.education.edutrack.controller;

import com.education.edutrack.entity.StudentEntity;
import com.education.edutrack.repository.StudentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentRepository studentRepository;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // GET all students
    @GetMapping
    public List<StudentEntity> getAllStudents() {
        return studentRepository.findAll();
    }

    // GET students by batch id
    @GetMapping("/batch/{batchId}")
    public List<StudentEntity> getStudentsByBatch(@PathVariable String batchId) {
        return studentRepository.findByBatchId(batchId);
    }

    // POST new student
    @PostMapping
    public StudentEntity createStudent(@RequestBody StudentEntity student) {
        return studentRepository.save(student);
    }
}

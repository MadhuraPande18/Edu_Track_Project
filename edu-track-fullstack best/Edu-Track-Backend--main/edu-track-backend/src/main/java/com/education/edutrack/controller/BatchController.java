package com.education.edutrack.controller;

import com.education.edutrack.entity.BatchEntity;
import com.education.edutrack.repository.BatchRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/batches")
public class BatchController {

    private final BatchRepository batchRepository;

    public BatchController(BatchRepository batchRepository) {
        this.batchRepository = batchRepository;
    }

    // GET all batches
    @GetMapping
    public List<BatchEntity> getAllBatches() {
        return batchRepository.findAll();
    }

    // POST new batch
    @PostMapping
    public BatchEntity createBatch(@RequestBody BatchEntity batch) {
        return batchRepository.save(batch);
    }

    // Simple test
    @GetMapping("/test")
    public String test() {
        return "Batch controller working!";
    }
}

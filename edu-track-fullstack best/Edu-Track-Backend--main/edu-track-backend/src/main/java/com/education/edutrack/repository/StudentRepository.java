package com.education.edutrack.repository;

import com.education.edutrack.entity.StudentEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface StudentRepository extends MongoRepository<StudentEntity, String> {

    List<StudentEntity> findByBatchId(String batchId);
}

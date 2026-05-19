package com.education.edutrack.repository;

import com.education.edutrack.entity.BatchEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BatchRepository extends MongoRepository<BatchEntity, String> {
}

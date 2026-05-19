package com.education.edutrack.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "batches")
public class BatchEntity {

    @Id
    private String id;

    private String name;
    private String trainerName;
    private String startDate;
    private String endDate;
    private Integer totalStudents;
    private String status;
}

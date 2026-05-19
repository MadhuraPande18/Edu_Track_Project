package com.education.edutrack.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "students")
public class StudentEntity {

    @Id
    private String id;

    private String name;
    private String email;
    private String phone;
    private String course;
    private String batchId;
    private String enrollmentDate;
}

package com.example.PlacePrep.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AttemptedExamDTO {
    private int userId;
    private int examId;
    private LocalDate examDate;
    private LocalTime examTime;
    private LocalDate submittedDate;
    private LocalTime submittedTime;
    private Integer obtainedMarks;
    private Integer totalMarks;
    private Integer passingMarks;
    private String passingStatus;
}

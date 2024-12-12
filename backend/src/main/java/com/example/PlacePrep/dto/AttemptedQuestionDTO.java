package com.example.PlacePrep.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AttemptedQuestionDTO {
    private int userId;
    private int examId;
    private int questionId;
    private String selectedOption;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

package com.example.PlacePrep.dto;


import lombok.Data;
import org.w3c.dom.Text;

import java.time.LocalDateTime;

@Data
public class AttemptedProgrammingQuestionDTO{
    private int userId;
    private int examId;
    private int programmingQuestionId;
    private String answer;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

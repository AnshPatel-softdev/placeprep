package com.example.PlacePrep.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "programming_questions")
public class ProgrammingQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "question_content", columnDefinition = "TEXT")
    private String questionContent;

    @Column(name = "solution1", columnDefinition = "TEXT")
    private String solution1;

    @Column(name = "solution2", columnDefinition = "TEXT",nullable = true)
    private String solution2;

    @Column(name = "solution3", columnDefinition = "TEXT",nullable = true)
    private String solution3;

    @Column(name = "solution4", columnDefinition = "TEXT",nullable = true)
    private String solution4;

    @Column(name = "difficulty")
    private String difficulty;

    @Column(name = "created_by")
    private int createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

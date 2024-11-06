package com.example.PlacePrep.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String quesdesc;
    private String option1;
    private String option2;
    private String option3;
    private String option4;
    private String answer;
    private String type;
    private String difficulty;
}

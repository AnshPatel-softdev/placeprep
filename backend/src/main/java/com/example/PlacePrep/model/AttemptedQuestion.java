package com.example.PlacePrep.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "attempted_questions")
public class AttemptedQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "userid", nullable = false, referencedColumnName = "id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "examid", nullable = false)
    private Exam exam;

    @ManyToOne
    @JoinColumn(name = "questionid", nullable = false)
    private Question question;

    @Column(name = "selected_option", nullable = false)
    private String selectedOption;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

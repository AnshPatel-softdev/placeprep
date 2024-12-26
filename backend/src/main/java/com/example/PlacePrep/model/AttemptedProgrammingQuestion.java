package com.example.PlacePrep.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.w3c.dom.Text;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class AttemptedProgrammingQuestion {
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
    @JoinColumn(name = "programmingquestionid", nullable = false)
    private ProgrammingQuestion programmingQuestion;

    @Column(name = "answer", nullable = false,columnDefinition = "TEXT")
    private String answer;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

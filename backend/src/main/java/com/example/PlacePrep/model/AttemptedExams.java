package com.example.PlacePrep.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@Table(name = "attempted_exams")
public class AttemptedExams {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "userid", nullable = false, referencedColumnName = "id")
    private User user;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "examid", nullable = false, referencedColumnName = "examid",
            foreignKey = @ForeignKey(name = "FK_AttemptedExams_Exam",
                    value = ConstraintMode.CONSTRAINT,
                    foreignKeyDefinition = "FOREIGN KEY (examid) REFERENCES exams(examid) ON DELETE CASCADE"))
    private Exam exam;

    @Column(name = "exam_date")
    private LocalDate examDate;

    @Column(name = "exam_time")
    private LocalTime examTime;

    @Column(name = "submitted_date")
    private LocalDate submittedDate;

    @Column(name = "submitted_time")
    private LocalTime submittedTime;

    @Column(name = "obtained_marks")
    private Integer obtainedMarks;

    @Column(name = "total_marks")
    private Integer totalMarks;

    @Column(name = "passing_marks")
    private Integer passingMarks;

    @Column(name = "passing_status")
    private String passingStatus;
}
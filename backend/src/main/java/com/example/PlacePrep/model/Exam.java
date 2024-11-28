package com.example.PlacePrep.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "exams")
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "examid")
    private int id;

    @Column(name = "exam_name")
    private String exam_name;

    @Column(name = "no_of_questions")
    private Integer no_of_questions;

    @Column(name = "exam_start_date")
    private LocalDate exam_start_date;

    @Column(name = "exam_start_time")
    private LocalTime exam_start_time;

    @Column(name = "exam_end_date")
    private LocalDate exam_end_date;

    @Column(name = "exam_end_time")
    private LocalTime exam_end_time;

    @Column(name = "college")
    private String college;

    @Column(name = "branch")
    private String branch;

    @Column(name = "semester")
    private Integer semester;

    @Column(name = "total_marks")
    private Integer total_marks;

    @Column(name = "passing_marks")
    private Integer passing_marks;

    @Column(name = "duration")
    private Integer duration;

    @Column(name = "created_by")
    private Integer created_by;

    @Column(name = "created_at")
    private LocalDateTime created_at;

    @Column(name = "updated_at")
    private LocalDateTime updated_at;
}
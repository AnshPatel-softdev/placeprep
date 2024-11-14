package com.example.PlacePrep.service;


import com.example.PlacePrep.model.Exam;
import com.example.PlacePrep.repository.ExamRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;

import java.time.LocalDateTime;

@Service
@Slf4j
public class ExamService {

    @Autowired
    private ExamRepository examRepository;

    @PostMapping
    public void addExam(Exam exam) {
        exam.setCreated_at(LocalDateTime.now());
        exam.setUpdated_at(LocalDateTime.now());
        examRepository.save(exam);
    }
}

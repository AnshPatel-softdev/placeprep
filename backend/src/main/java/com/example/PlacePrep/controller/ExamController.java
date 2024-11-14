package com.example.PlacePrep.controller;


import com.example.PlacePrep.model.Exam;
import com.example.PlacePrep.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/exam")
@CrossOrigin(origins = "http://localhost:5173/admin")

public class ExamController {

    @Autowired
    private ExamService examService;

    @PostMapping
    public ResponseEntity<?> addExam(@RequestBody Exam exam) {
        examService.addExam(exam);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

}

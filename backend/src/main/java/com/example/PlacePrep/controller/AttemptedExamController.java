package com.example.PlacePrep.controller;

import com.example.PlacePrep.dto.AttemptedExamDTO;
import com.example.PlacePrep.model.AttemptedExams;
import com.example.PlacePrep.service.AttemptedExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/attemptedexam")
@CrossOrigin(origins = {"http://localhost:5173/exam","http://localhost:5173/student"})
public class AttemptedExamController {

    @Autowired
    private AttemptedExamService attemptedExamService;

    @PostMapping
    public ResponseEntity<?> addAttemptedExam(@RequestBody AttemptedExamDTO attemptedExamDTO) {
        attemptedExamService.save(attemptedExamDTO);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<?> getAttemptedExams() {
        return new ResponseEntity<>(attemptedExamService.getAttemptedExams(), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAttemptedExam(@RequestBody AttemptedExams attemptedExams, @PathVariable int id) {
        attemptedExamService.update(attemptedExams);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAttemptedExam(@PathVariable int id) {
        attemptedExamService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}

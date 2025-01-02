package com.example.PlacePrep.controller;


import com.example.PlacePrep.dto.AttemptedProgrammingQuestionDTO;
import com.example.PlacePrep.service.AttemptedProgrammingQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/attempted_programming_question")
@CrossOrigin(origins = {"http://localhost:5173/admin","http://localhost:5173/student","http://localhost:5173/exam"})
public class AttemptedProgrammingQuestionController {


    @Autowired
    private AttemptedProgrammingQuestionService attemptedProgrammingQuestionService;
    @GetMapping
    public ResponseEntity<?> getAttemptedProgrammingQuestions()
    {
        return new ResponseEntity<>(attemptedProgrammingQuestionService.getAttemptedProgrammingQuestions(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> saveAttemptedProgrammingQuestion(@RequestBody AttemptedProgrammingQuestionDTO attemptedProgrammingQuestionDTO)
    {
        attemptedProgrammingQuestionService.save(attemptedProgrammingQuestionDTO);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping("/{userId}/{examId}")
    public ResponseEntity<?> deleteAttemptedProgrammingQuestionByUserIdAndExamId(@PathVariable int userId, @PathVariable int examId)
    {
        attemptedProgrammingQuestionService.deleteAttemptedProgrammingQuestionByUserIdAndExamId(userId, examId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}

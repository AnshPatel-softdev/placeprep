package com.example.PlacePrep.controller;

import com.example.PlacePrep.dto.AttemptedQuestionDTO;
import com.example.PlacePrep.model.AttemptedQuestion;
import com.example.PlacePrep.service.AttemptedQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/attempted_question")
@CrossOrigin(origins = {"http://localhost:5173/admin","http://localhost:5173/student"})
public class AttemptedQuestionController {

    @Autowired
    private AttemptedQuestionService attemptedQuestionService;
    @PostMapping
    public ResponseEntity<?> saveAttemptedQuestion(@RequestBody AttemptedQuestionDTO attemptedQuestiondto)
    {
        attemptedQuestionService.save(attemptedQuestiondto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<?> getAttemptedQuestions()
    {
        return new ResponseEntity<>(attemptedQuestionService.getAttemptedQuestions(), HttpStatus.OK);
    }

    @DeleteMapping("/{userId}/{examId}")
    public ResponseEntity<?> deleteAttemptedQuestionByUserIdAndExamId(@PathVariable int userId, @PathVariable int examId)
    {
        attemptedQuestionService.deleteAttemptedQuestionByUserIdAndExamId(userId, examId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<?> updateAttemptedQuestionByUserIdAndExamIdAndQuestionId(@RequestBody AttemptedQuestionDTO attemptedQuestiondto)
    {
        attemptedQuestionService.updateAttemptedQuestionByUserIdAndExamIdAndQuestionId(attemptedQuestiondto);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}

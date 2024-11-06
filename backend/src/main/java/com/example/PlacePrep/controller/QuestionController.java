package com.example.PlacePrep.controller;

import com.example.PlacePrep.model.Question;
import com.example.PlacePrep.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/question")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @GetMapping
    public ResponseEntity<?> getAllQuestions() {
        return new ResponseEntity<>(questionService.getAllQuestions(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> saveQuestion(@RequestBody  Question question) {
        questionService.saveQuestion(question);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<?> updateQuestion(@RequestBody  Question question) {
        System.out.println(question.getAnswer());
        questionService.updateQuestion(question);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable int id) {
        questionService.deleteQuestion(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}

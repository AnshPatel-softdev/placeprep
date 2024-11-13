package com.example.PlacePrep.controller;

import com.example.PlacePrep.model.Question;
import com.example.PlacePrep.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/question")
@CrossOrigin(origins = "http://localhost:5173/admin")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @GetMapping
    public ResponseEntity<?> getAllQuestions() {
        return new ResponseEntity<>(questionService.getAllQuestions(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> saveQuestion(@RequestBody Question question) {
        questionService.saveQuestion(question);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("{id}")
    public ResponseEntity<?> updateQuestion(@RequestBody  Question question,@PathVariable int id){
        questionService.updateQuestion(question,id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable int id) {
        questionService.deleteQuestion(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(value = "/upload-questions", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadQuestions(@RequestParam("file") MultipartFile file) {
        try {
            questionService.saveQuestionFromExcel(file);
            return ResponseEntity.ok().body("Users uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Error processing file: " + e.getMessage());
        }
    }
}

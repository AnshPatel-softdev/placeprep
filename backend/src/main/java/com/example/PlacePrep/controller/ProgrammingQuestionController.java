package com.example.PlacePrep.controller;


import com.example.PlacePrep.model.ProgrammingQuestion;
import com.example.PlacePrep.service.ProgrammingQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/programming-question")
@CrossOrigin(origins = "http://localhost:5173/admin")
public class ProgrammingQuestionController {

    @Autowired
    private ProgrammingQuestionService programmingQuestionService;

    @PostMapping
    public ResponseEntity<?> save(@RequestBody ProgrammingQuestion programmingQuestion) {
        programmingQuestionService.save(programmingQuestion);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<?> getAllProgrammingQuestions() {
        return new ResponseEntity<>(programmingQuestionService.getAllProgrammingQuestions(), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        programmingQuestionService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<?> update(@RequestBody ProgrammingQuestion programmingQuestion) {
        programmingQuestionService.update(programmingQuestion);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}

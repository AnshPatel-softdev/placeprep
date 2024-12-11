package com.example.PlacePrep.controller;


import com.example.PlacePrep.model.Exam;
import com.example.PlacePrep.model.Question;
import com.example.PlacePrep.service.ExamService;
import com.example.PlacePrep.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/exam")
@CrossOrigin(origins = {"http://localhost:5173/admin","http://localhost:5173/student"})

public class ExamController {

    @Autowired
    private ExamService examService;

    @Autowired
    private QuestionService questionService;

    @PostMapping
    public ResponseEntity<?> addExam(@RequestBody Exam exam) {
        Iterable<Question> questions = questionService.getAllQuestions();
        examService.addExam(exam,questions);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/{examid}")
    public ResponseEntity<?> getExamQuestions(@PathVariable int examid) {
        return new ResponseEntity<>(examService.getExamQuestions(examid), HttpStatus.OK);
    }
    @GetMapping
    public ResponseEntity<?> getExams() {
        return new ResponseEntity<>(examService.getExams(), HttpStatus.OK);
    }

    @PutMapping("/{examid}")
    public ResponseEntity<?> updateExam(@RequestBody Exam exam, @PathVariable int examid) {
        examService.updateExam(exam,examid);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @DeleteMapping("/{examid}/{questionid}")
    public ResponseEntity<?> deleteExamQuestion(@PathVariable int examid, @PathVariable int questionid) {
        examService.deleteExamQuestion(examid,questionid);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/{examid}")
    public ResponseEntity<?> addExamQuestion(@PathVariable int examid, @RequestBody Question question) {
        examService.addExamQuestion(examid,question);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
    @DeleteMapping("/{examid}")
    public ResponseEntity<?> deleteExam(@PathVariable int examid) {
        examService.deleteExam(examid);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}

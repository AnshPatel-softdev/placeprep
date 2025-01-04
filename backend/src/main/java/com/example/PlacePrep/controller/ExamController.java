package com.example.PlacePrep.controller;


import com.example.PlacePrep.model.Exam;
import com.example.PlacePrep.model.ProgrammingQuestion;
import com.example.PlacePrep.model.Question;
import com.example.PlacePrep.service.ExamService;
import com.example.PlacePrep.service.ProgrammingQuestionService;
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

    @Autowired
    private ProgrammingQuestionService programmingQuestionService;

    @PostMapping
    public ResponseEntity<?> addExam(@RequestBody Exam exam) {
        Iterable<Question> questions = questionService.getAllQuestions();
        Iterable<ProgrammingQuestion> programmingQuestions = programmingQuestionService.getAllProgrammingQuestions();
        examService.addExam(exam,questions,programmingQuestions);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/{examid}")
    public ResponseEntity<?> getExamQuestions(@PathVariable int examid) {
        return new ResponseEntity<>(examService.getExamQuestions(examid), HttpStatus.OK);
    }

    @GetMapping("/programming/{examid}")
    public ResponseEntity<?> getExamProgrammingQuestions(@PathVariable int examid) {
        return new ResponseEntity<>(examService.getExamProgrammingQuestions(examid), HttpStatus.OK);
    }

    @PostMapping("/programming/{examid}")
    public ResponseEntity<?> addExamProgrammingQuestion(@PathVariable int examid, @RequestBody ProgrammingQuestion programmingQuestion) {
        examService.addExamProgrammingQuestion(examid,programmingQuestion);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping("/programming/{examid}/{questionid}")
    public ResponseEntity<?> deleteExamProgrammingQuestion(@PathVariable int examid, @PathVariable int questionid) {
        examService.deleteExamProgrammingQuestion(examid,questionid);
        return new ResponseEntity<>(HttpStatus.OK);
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

package com.example.PlacePrep.service;

import com.example.PlacePrep.model.Question;
import com.example.PlacePrep.repository.QuestionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

@Service
@Slf4j
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @GetMapping
    public Iterable<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    @PostMapping
        public void saveQuestion(Question question) {
            questionRepository.save(question);
        }

    @PutMapping
    public void updateQuestion(Question question) {
        Question question1 = questionRepository.findById(question.getId());
        question1.setQuesdesc(question.getQuesdesc());
        question1.setOption1(question.getOption1());
        question1.setOption2(question.getOption2());
        question1.setOption3(question.getOption3());
        question1.setOption4(question.getOption4());
        question1.setAnswer(question.getAnswer());
        question1.setType(question.getType());
        question1.setDifficulty(question.getDifficulty());
        questionRepository.save(question1);
    }

    @DeleteMapping
    public void deleteQuestion(int id) {
        questionRepository.delete(questionRepository.findById(id));
    }
}

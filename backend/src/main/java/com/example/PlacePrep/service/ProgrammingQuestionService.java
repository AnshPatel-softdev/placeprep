package com.example.PlacePrep.service;


import com.example.PlacePrep.model.ProgrammingQuestion;
import com.example.PlacePrep.repository.ProgrammingQuestionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ProgrammingQuestionService {


    @Autowired
    private ProgrammingQuestionRepository programmingQuestionRepository;
    public void save(ProgrammingQuestion programmingQuestion) {
        programmingQuestionRepository.save(programmingQuestion);
    }

    public void delete(int id) {
        programmingQuestionRepository.deleteById(id);
    }

    public Iterable<ProgrammingQuestion> getAllProgrammingQuestions() {
        return programmingQuestionRepository.findAll();
    }

    public void update(ProgrammingQuestion programmingQuestion) {
        ProgrammingQuestion programmingQuestion1 = programmingQuestionRepository.findById(programmingQuestion.getId());
        programmingQuestion1.setQuestionContent(programmingQuestion.getQuestionContent());
        programmingQuestion1.setSolution1(programmingQuestion.getSolution1());
        programmingQuestion1.setSolution2(programmingQuestion.getSolution2());
        programmingQuestion1.setSolution3(programmingQuestion.getSolution3());
        programmingQuestion1.setSolution4(programmingQuestion.getSolution4());
        programmingQuestion1.setDifficulty(programmingQuestion.getDifficulty());
        programmingQuestion1.setCreatedBy(programmingQuestion.getCreatedBy());
        programmingQuestion1.setCreatedAt(programmingQuestion.getCreatedAt());
        programmingQuestion1.setUpdatedAt(programmingQuestion.getUpdatedAt());
        programmingQuestionRepository.save(programmingQuestion1);
    }
}

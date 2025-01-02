package com.example.PlacePrep.service;


import com.example.PlacePrep.dto.AttemptedProgrammingQuestionDTO;
import com.example.PlacePrep.model.AttemptedProgrammingQuestion;
import com.example.PlacePrep.repository.AttemptedProgrammingQuestionRepository;
import com.example.PlacePrep.repository.ExamRepository;
import com.example.PlacePrep.repository.ProgrammingQuestionRepository;
import com.example.PlacePrep.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
public class AttemptedProgrammingQuestionService {

    @Autowired
    private AttemptedProgrammingQuestionRepository attemptedProgrammingQuestionRepository;

    @Autowired
    private ProgrammingQuestionRepository programmingQuestionRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private UserRepository userRepository;

    public void save(AttemptedProgrammingQuestionDTO attemptedProgrammingQuestionDTO)
    {
        AttemptedProgrammingQuestion attemptedProgrammingQuestion = new AttemptedProgrammingQuestion();
        attemptedProgrammingQuestion.setUser(userRepository.findById(attemptedProgrammingQuestionDTO.getUserId()));
        attemptedProgrammingQuestion.setProgrammingQuestion(programmingQuestionRepository.findById(attemptedProgrammingQuestionDTO.getProgrammingQuestionId()));
        attemptedProgrammingQuestion.setExam(examRepository.findById(attemptedProgrammingQuestionDTO.getExamId()));
        attemptedProgrammingQuestion.setAnswer(attemptedProgrammingQuestionDTO.getAnswer());
        attemptedProgrammingQuestion.setCreatedAt(LocalDateTime.now());
        attemptedProgrammingQuestion.setUpdatedAt(LocalDateTime.now());
        attemptedProgrammingQuestionRepository.save(attemptedProgrammingQuestion);
    }

    public Iterable<AttemptedProgrammingQuestion> getAttemptedProgrammingQuestions()
    {
        return attemptedProgrammingQuestionRepository.findAll();
    }

    public void deleteAttemptedProgrammingQuestionByUserIdAndExamId(int userId, int examId)
    {
        attemptedProgrammingQuestionRepository.deleteByUserIdAndExamId(userId, examId);
    }
}

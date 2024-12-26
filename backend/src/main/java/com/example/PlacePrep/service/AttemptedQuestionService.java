package com.example.PlacePrep.service;

import com.example.PlacePrep.dto.AttemptedQuestionDTO;
import com.example.PlacePrep.model.AttemptedQuestion;
import com.example.PlacePrep.model.User;
import com.example.PlacePrep.repository.AttemptedQuestionRepository;
import com.example.PlacePrep.repository.ExamRepository;
import com.example.PlacePrep.repository.QuestionRepository;
import com.example.PlacePrep.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Slf4j
@Transactional
public class AttemptedQuestionService {

    @Autowired
    private AttemptedQuestionRepository attemptedQuestionRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private UserRepository userRepository;
    public void save(AttemptedQuestionDTO attemptedQuestiondto)
    {
        AttemptedQuestion attemptedQuestion = new AttemptedQuestion();
        attemptedQuestion.setUser(userRepository.findById(attemptedQuestiondto.getUserId()));
        attemptedQuestion.setQuestion(questionRepository.findById(attemptedQuestiondto.getQuestionId()));
        attemptedQuestion.setExam(examRepository.findById(attemptedQuestiondto.getExamId()));
        attemptedQuestion.setSelectedOption(attemptedQuestiondto.getSelectedOption());
        attemptedQuestion.setCreatedAt(LocalDateTime.now());
        attemptedQuestion.setUpdatedAt(LocalDateTime.now());
        attemptedQuestionRepository.save(attemptedQuestion);
    }

    public Iterable<AttemptedQuestion> getAttemptedQuestions()
    {
        return attemptedQuestionRepository.findAll();
    }

    public void deleteAttemptedQuestionByUserIdAndExamId(int userId, int examId)
    {
        attemptedQuestionRepository.deleteByUserIdAndExamId(userId, examId);
    }

    public void updateAttemptedQuestionByUserIdAndExamIdAndQuestionId(AttemptedQuestionDTO attemptedQuestiondto)
    {
        AttemptedQuestion attemptedQuestion1 = attemptedQuestionRepository.findTopByUserIdAndExamIdAndQuestionIdOrderByCreatedAtDesc(attemptedQuestiondto.getUserId(), attemptedQuestiondto.getExamId(), attemptedQuestiondto.getQuestionId());
        attemptedQuestion1.setSelectedOption(attemptedQuestiondto.getSelectedOption());
        attemptedQuestionRepository.save(attemptedQuestion1);
    }
}

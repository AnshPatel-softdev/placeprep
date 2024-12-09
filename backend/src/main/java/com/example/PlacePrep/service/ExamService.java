package com.example.PlacePrep.service;


import com.example.PlacePrep.model.AttemptedExams;
import com.example.PlacePrep.model.Exam;
import com.example.PlacePrep.model.ExamQuestion;
import com.example.PlacePrep.model.Question;
import com.example.PlacePrep.repository.AttemptedExamRepository;
import com.example.PlacePrep.repository.ExamQuestionRepository;
import com.example.PlacePrep.repository.ExamRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@Slf4j
@Transactional
public class ExamService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private ExamQuestionRepository examQuestionRepository;
    @Autowired
    private AttemptedExamRepository attemptedExamRepository;

    public void addExam(Exam exam, Iterable<Question> questions) {
        exam.setCollege(exam.getCollege().toUpperCase());
        exam.setCreated_at(LocalDateTime.now());
        exam.setUpdated_at(LocalDateTime.now());
        examRepository.save(exam);

        List<Question> questionList = StreamSupport.stream(questions.spliterator(), false)
                .collect(Collectors.toList());

        int numberOfQuestions = exam.getNo_of_questions();

        List<Question> randomQuestions = getRandomQuestions(questionList, numberOfQuestions);

        List<ExamQuestion> examQuestions = new ArrayList<>();
        for (Question question : randomQuestions) {
            ExamQuestion examQuestion = new ExamQuestion();
            examQuestion.setExam(exam);
            examQuestion.setQuestion(question);
            examQuestion.setCreatedBy(exam.getCreated_by());
            examQuestion.setCreatedAt(LocalDateTime.now());

            examQuestions.add(examQuestion);
        }

        examQuestionRepository.saveAll(examQuestions);
    }

    public Iterable<Exam> getExams() {
        return examRepository.findAll();
    }

    public void updateExam(Exam exam,int examid) {
        Exam exam1 = examRepository.findById(examid);
        exam1.setExam_name(exam.getExam_name());
        exam1.setNo_of_questions(exam.getNo_of_questions());
        exam1.setExam_start_date(exam.getExam_start_date());
        exam1.setExam_start_time(exam.getExam_start_time());
        exam1.setExam_end_date(exam.getExam_end_date());
        exam1.setExam_end_time(exam.getExam_end_time());
        exam1.setCollege(exam.getCollege());
        exam1.setTotal_marks(exam.getTotal_marks());
        exam1.setDuration(exam.getDuration());
        exam1.setCreated_by(exam.getCreated_by());
        exam1.setUpdated_at(LocalDateTime.now());
        examRepository.save(exam1);
    }

    private List<Question> getRandomQuestions(List<Question> availableQuestions, int numberOfQuestions) {
        // Check if we have enough questions
        if (availableQuestions.size() <= numberOfQuestions) {
            return availableQuestions;
        }

        // Create a copy of the list to shuffle
        List<Question> shuffledQuestions = new ArrayList<>(availableQuestions);

        // Shuffle the questions
        Collections.shuffle(shuffledQuestions);

        // Return the first 'numberOfQuestions' questions
        return shuffledQuestions.subList(0, numberOfQuestions);
    }

    public Iterable<ExamQuestion> getExamQuestions(int examid) {
        return examQuestionRepository.findByExamId(examid);
    }
    public void deleteExam(int examid) {
        attemptedExamRepository.deleteByExamId(examid);
        examRepository.deleteById(examid);
    }
}

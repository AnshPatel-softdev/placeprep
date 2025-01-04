package com.example.PlacePrep.service;


import com.example.PlacePrep.model.*;
import com.example.PlacePrep.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.method.P;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

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

    @Autowired
    private ExamProgrammingQuestionRepository examProgrammingQuestionRepository;

    @Autowired
    private AttemptedQuestionRepository attemptedQuestionRepository;

    @Autowired
    private AttemptedProgrammingQuestionRepository attemptedProgrammingQuestionRepository;

    private List<Question> filterQuestionsByDifficultyAndType(List<Question> questions, String difficulty, String type) {
        return questions.stream()
                .filter(q -> q.getDifficulty().equals(difficulty) && q.getType().equals(type))
                .collect(Collectors.toList());
    }

    private List<Question> selectQuestionsWithDifficultyDistribution(List<Question> typeFilteredQuestions,
                                                                     String examDifficulty, int requiredCount) {
        List<Question> selectedQuestions = new ArrayList<>();
        List<Question> easyQuestions = typeFilteredQuestions.stream()
                .filter(q -> q.getDifficulty().equals("Easy"))
                .collect(Collectors.toList());
        List<Question> mediumQuestions = typeFilteredQuestions.stream()
                .filter(q -> q.getDifficulty().equals("Medium"))
                .collect(Collectors.toList());
        List<Question> hardQuestions = typeFilteredQuestions.stream()
                .filter(q -> q.getDifficulty().equals("Hard"))
                .collect(Collectors.toList());

        switch (examDifficulty) {
            case "EASY":
                int easyCount = (int) Math.ceil(requiredCount * 0.6);
                int mediumCount = requiredCount - easyCount;
                selectedQuestions.addAll(getRandomQuestions(easyQuestions, easyCount));
                selectedQuestions.addAll(getRandomQuestions(mediumQuestions, mediumCount));
                break;

            case "MEDIUM":
                easyCount = (int) Math.ceil(requiredCount * 0.2);
                mediumCount = (int) Math.ceil(requiredCount * 0.5);
                int hardCount = requiredCount - easyCount - mediumCount;
                selectedQuestions.addAll(getRandomQuestions(easyQuestions, easyCount));
                selectedQuestions.addAll(getRandomQuestions(mediumQuestions, mediumCount));
                selectedQuestions.addAll(getRandomQuestions(hardQuestions, hardCount));
                break;

            case "HARD":
                mediumCount = (int) Math.ceil(requiredCount * 0.4);
                hardCount = requiredCount - mediumCount;
                selectedQuestions.addAll(getRandomQuestions(mediumQuestions, mediumCount));
                selectedQuestions.addAll(getRandomQuestions(hardQuestions, hardCount));
                break;
        }

        Collections.shuffle(selectedQuestions);
        return selectedQuestions;
    }
    private List<ProgrammingQuestion> selectProgrammingQuestionsWithDifficultyDistribution(
            List<ProgrammingQuestion> programmingQuestions,
            String examDifficulty,
            int requiredCount) {

        List<ProgrammingQuestion> selectedQuestions = new ArrayList<>();

        List<ProgrammingQuestion> easyQuestions = programmingQuestions.stream()
                .filter(q -> q.getDifficulty().equals("Easy"))
                .collect(Collectors.toList());

        List<ProgrammingQuestion> mediumQuestions = programmingQuestions.stream()
                .filter(q -> q.getDifficulty().equals("Medium"))
                .collect(Collectors.toList());

        List<ProgrammingQuestion> hardQuestions = programmingQuestions.stream()
                .filter(q -> q.getDifficulty().equals("Hard"))
                .collect(Collectors.toList());

        switch (examDifficulty) {
            case "EASY":
                int easyCount = (int) Math.ceil(requiredCount * 0.6);
                int mediumCount = requiredCount - easyCount;
                selectedQuestions.addAll(getRandomProgrammingQuestions(easyQuestions, easyCount));
                selectedQuestions.addAll(getRandomProgrammingQuestions(mediumQuestions, mediumCount));
                break;

            case "MEDIUM":
                easyCount = (int) Math.ceil(requiredCount * 0.2);
                mediumCount = (int) Math.ceil(requiredCount * 0.5);
                int hardCount = requiredCount - easyCount - mediumCount;
                selectedQuestions.addAll(getRandomProgrammingQuestions(easyQuestions, easyCount));
                selectedQuestions.addAll(getRandomProgrammingQuestions(mediumQuestions, mediumCount));
                selectedQuestions.addAll(getRandomProgrammingQuestions(hardQuestions, hardCount));
                break;

            case "HARD":
                mediumCount = (int) Math.ceil(requiredCount * 0.4);
                hardCount = requiredCount - mediumCount;
                selectedQuestions.addAll(getRandomProgrammingQuestions(mediumQuestions, mediumCount));
                selectedQuestions.addAll(getRandomProgrammingQuestions(hardQuestions, hardCount));
                break;
        }

        Collections.shuffle(selectedQuestions);
        return selectedQuestions;
    }

    public void addExamProgrammingQuestion(int examid, ProgrammingQuestion programmingQuestion) {
        Exam exam = examRepository.findById(examid);
        ExamProgrammingQuestion examProgrammingQuestion = new ExamProgrammingQuestion();
        examProgrammingQuestion.setExam(exam);
        examProgrammingQuestion.setProgrammingQuestion(programmingQuestion);
        examProgrammingQuestion.setCreatedBy(exam.getCreated_by());
        examProgrammingQuestion.setCreatedAt(LocalDateTime.now());
        examProgrammingQuestionRepository.save(examProgrammingQuestion);
    }

    public void deleteExamProgrammingQuestion(int examid, int questionid) {
        examProgrammingQuestionRepository.deleteByExamIdAndProgrammingQuestionId(examid,questionid);
    }
    public void addExam(Exam exam, Iterable<Question> questions, Iterable<ProgrammingQuestion> programmingQuestions) {
        exam.setCollege(exam.getCollege().toUpperCase());
        exam.setCreated_at(LocalDateTime.now());
        exam.setUpdated_at(LocalDateTime.now());
        examRepository.save(exam);

        List<Question> allQuestions = StreamSupport.stream(questions.spliterator(), false)
                .collect(Collectors.toList());

        List<Question> logicalQuestions = allQuestions.stream()
                .filter(q -> q.getType().equals("Logical"))
                .collect(Collectors.toList());

        List<Question> technicalQuestions = allQuestions.stream()
                .filter(q -> q.getType().equals("Technical"))
                .collect(Collectors.toList());

        List<Question> programmingMcqQuestions = allQuestions.stream()
                .filter(q -> q.getType().equals("Programming"))
                .collect(Collectors.toList());

        List<Question> selectedLogicalQuestions = selectQuestionsWithDifficultyDistribution(
                logicalQuestions,
                exam.getDifficulty(),
                exam.getNo_of_Logical_questions()
        );

        List<Question> selectedTechnicalQuestions = selectQuestionsWithDifficultyDistribution(
                technicalQuestions,
                exam.getDifficulty(),
                exam.getNo_of_Technical_questions()
        );

        List<Question> selectedProgrammingMcqQuestions = selectQuestionsWithDifficultyDistribution(
                programmingMcqQuestions,
                exam.getDifficulty(),
                exam.getNo_of_Programming_mcq_questions()
        );

        List<Question> allSelectedQuestions = new ArrayList<>();
        allSelectedQuestions.addAll(selectedLogicalQuestions);
        allSelectedQuestions.addAll(selectedTechnicalQuestions);
        allSelectedQuestions.addAll(selectedProgrammingMcqQuestions);

        List<ExamQuestion> examQuestions = allSelectedQuestions.stream().map(question -> {
            ExamQuestion examQuestion = new ExamQuestion();
            examQuestion.setExam(exam);
            examQuestion.setQuestion(question);
            examQuestion.setCreatedBy(exam.getCreated_by());
            examQuestion.setCreatedAt(LocalDateTime.now());
            return examQuestion;
        }).collect(Collectors.toList());

        examQuestionRepository.saveAll(examQuestions);

        List<ProgrammingQuestion> programmingQuestionList = StreamSupport.stream(
                programmingQuestions.spliterator(),
                false
        ).collect(Collectors.toList());

        List<ProgrammingQuestion> selectedProgrammingQuestions = selectProgrammingQuestionsWithDifficultyDistribution(
                programmingQuestionList,
                exam.getDifficulty(),
                exam.getNo_of_programming_questions()
        );

        List<ExamProgrammingQuestion> examProgrammingQuestions = selectedProgrammingQuestions.stream()
                .map(programmingQuestion -> {
                    ExamProgrammingQuestion examProgrammingQuestion = new ExamProgrammingQuestion();
                    examProgrammingQuestion.setExam(exam);
                    examProgrammingQuestion.setProgrammingQuestion(programmingQuestion);
                    examProgrammingQuestion.setCreatedBy(exam.getCreated_by());
                    examProgrammingQuestion.setCreatedAt(LocalDateTime.now());
                    return examProgrammingQuestion;
                }).collect(Collectors.toList());

        examProgrammingQuestionRepository.saveAll(examProgrammingQuestions);
    }

    private List<ProgrammingQuestion> getRandomProgrammingQuestions(
            List<ProgrammingQuestion> availableQuestions,
            int numberOfQuestions
    ) {
        if (availableQuestions.size() <= numberOfQuestions) {
            return availableQuestions;
        }
        List<ProgrammingQuestion> shuffledQuestions = new ArrayList<>(availableQuestions);
        Collections.shuffle(shuffledQuestions);
        return shuffledQuestions.subList(0, numberOfQuestions);
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
        if (availableQuestions.size() <= numberOfQuestions) {
            return availableQuestions;
        }

        List<Question> shuffledQuestions = new ArrayList<>(availableQuestions);

        Collections.shuffle(shuffledQuestions);

        return shuffledQuestions.subList(0, numberOfQuestions);
    }
    public void deleteExamQuestion(int examid, int questionid) {
        examQuestionRepository.deleteByExamIdAndQuestionId(examid,questionid);
    }

    public void addExamQuestion(int examid, Question question) {
        Exam exam = examRepository.findById(examid);
        ExamQuestion examQuestion = new ExamQuestion();
        examQuestion.setExam(exam);
        examQuestion.setQuestion(question);
        examQuestion.setCreatedBy(exam.getCreated_by());
        examQuestion.setCreatedAt(LocalDateTime.now());
        examQuestionRepository.save(examQuestion);
    }
    public Iterable<ExamQuestion> getExamQuestions(int examid) {
        return examQuestionRepository.findByExamId(examid);
    }
    public void deleteExam(int examid) {
        attemptedExamRepository.deleteByExamId(examid);
        examQuestionRepository.deleteByExamId(examid);
        attemptedQuestionRepository.deleteByExamId(examid);
        examProgrammingQuestionRepository.deleteByExamId(examid);
        attemptedProgrammingQuestionRepository.deleteByExamId(examid);
        examRepository.deleteById(examid);
    }
    public Iterable<ExamProgrammingQuestion> getExamProgrammingQuestions(int examid) {
        return examProgrammingQuestionRepository.findByExamId(examid);
    }
}

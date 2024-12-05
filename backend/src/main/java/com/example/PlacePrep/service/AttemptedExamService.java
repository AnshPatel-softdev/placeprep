package com.example.PlacePrep.service;

import com.example.PlacePrep.dto.AttemptedExamDTO;
import com.example.PlacePrep.model.AttemptedExams;
import com.example.PlacePrep.model.Exam;
import com.example.PlacePrep.model.User;
import com.example.PlacePrep.repository.AttemptedExamRepository;
import com.example.PlacePrep.repository.ExamRepository;
import com.example.PlacePrep.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@Transactional
public class AttemptedExamService {

    @Autowired
    private AttemptedExamRepository attemptedExamRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ExamRepository examRepository;

    public void save(AttemptedExamDTO dto) {
        User user = userRepository.findById(dto.getUserId());

        Exam exam = examRepository.findById(dto.getExamId());

        AttemptedExams attemptedExams = new AttemptedExams();
        attemptedExams.setUser(user);
        attemptedExams.setExam(exam);
        attemptedExams.setExamDate(dto.getExamDate());
        attemptedExams.setExamTime(dto.getExamTime());
        attemptedExams.setSubmittedDate(dto.getSubmittedDate());
        attemptedExams.setSubmittedTime(dto.getSubmittedTime());
        attemptedExams.setObtainedMarks(dto.getObtainedMarks());
        attemptedExams.setTotalMarks(dto.getTotalMarks());
        attemptedExams.setPassingMarks(dto.getPassingMarks());
        attemptedExams.setPassingStatus(dto.getPassingStatus());

        attemptedExamRepository.save(attemptedExams);
    }

    public void deleteById(int id) {
        attemptedExamRepository.deleteById(id);
    }

    public Iterable<AttemptedExams> getAttemptedExams() {
        return attemptedExamRepository.findAll();
    }
    public AttemptedExams findById(int id) {
        return attemptedExamRepository.findById(id);
    }

    public void update(AttemptedExams attemptedExams) {
        AttemptedExams attemptedExams1 = findById(attemptedExams.getId());
        if (attemptedExams1 == null) {
            log.error("Attempted Exam not found");
            return;
        }
        attemptedExams1.setUser(attemptedExams.getUser());
        attemptedExams1.setExam(attemptedExams.getExam());
        attemptedExams1.setExamDate(attemptedExams.getExamDate());
        attemptedExams1.setExamTime(attemptedExams.getExamTime());
        attemptedExams1.setSubmittedDate(attemptedExams.getSubmittedDate());
        attemptedExams1.setSubmittedTime(attemptedExams.getSubmittedTime());
        attemptedExams1.setObtainedMarks(attemptedExams.getObtainedMarks());
        attemptedExams1.setTotalMarks(attemptedExams.getTotalMarks());
        attemptedExams1.setPassingMarks(attemptedExams.getPassingMarks());
        attemptedExams1.setPassingStatus(attemptedExams.getPassingStatus());
        attemptedExamRepository.save(attemptedExams);
    }

    public void deleteByExamId(int id)
    {
        attemptedExamRepository.deleteByExamId(id);
    }
}

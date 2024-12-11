package com.example.PlacePrep.repository;

import com.example.PlacePrep.model.ExamQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExamQuestionRepository extends JpaRepository<ExamQuestion, Integer> {

    public void deleteByExamIdAndQuestionId(int examid,int questionid);

    public ExamQuestion findById(int id);

    public ExamQuestion findByExamIdAndQuestionId(int examId, int questionId);

    public Iterable<ExamQuestion> findByExamId(int examId);

    public void deleteByExamId(int examId);
}

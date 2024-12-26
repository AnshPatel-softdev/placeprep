package com.example.PlacePrep.repository;

import com.example.PlacePrep.model.ExamProgrammingQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExamProgrammingQuestionRepository extends JpaRepository<ExamProgrammingQuestion,Long> {

    public void deleteByExamIdAndProgrammingQuestionId(int examid,int questionid);

    public ExamProgrammingQuestion findById(int id);

    public ExamProgrammingQuestion findByExamIdAndProgrammingQuestionId(int examId, int questionId);

    public Iterable<ExamProgrammingQuestion> findByExamId(int examId);

    public void deleteByExamId(int examId);
}

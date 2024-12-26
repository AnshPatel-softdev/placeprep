package com.example.PlacePrep.repository;

import com.example.PlacePrep.model.AttemptedProgrammingQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttemptedProgrammingQuestionRepository extends JpaRepository<AttemptedProgrammingQuestion, Integer> {

    public Iterable<AttemptedProgrammingQuestion> findByUserIdAndExamId(int userId, int examId);

    public void deleteByUserIdAndExamId(int userId, int examId);

    public void deleteByExamId(int examid);

    public AttemptedProgrammingQuestion findByUserIdAndExamIdAndProgrammingQuestionId(int userId, int examId, int programmingQuestionId);
}

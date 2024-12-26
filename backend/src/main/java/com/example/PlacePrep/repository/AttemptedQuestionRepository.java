package com.example.PlacePrep.repository;

import com.example.PlacePrep.model.AttemptedQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttemptedQuestionRepository extends JpaRepository<AttemptedQuestion, Integer> {

    public Iterable<AttemptedQuestion> findByUserIdAndExamId(int userId, int examId);

    public void deleteByUserIdAndExamId(int userId, int examId);

    public void deleteByExamId(int examid);
    public AttemptedQuestion findTopByUserIdAndExamIdAndQuestionIdOrderByCreatedAtDesc(int userId, int examId, int questionId);
}

package com.example.PlacePrep.repository;

import com.example.PlacePrep.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    public Question findById(int id);
}

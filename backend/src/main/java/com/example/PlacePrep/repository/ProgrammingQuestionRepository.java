package com.example.PlacePrep.repository;

import com.example.PlacePrep.model.ProgrammingQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgrammingQuestionRepository extends JpaRepository<ProgrammingQuestion, Long> {

        public ProgrammingQuestion findById(int id);

        public void deleteById(int id);
}

package com.example.PlacePrep.repository;

import com.example.PlacePrep.model.AttemptedExams;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttemptedExamRepository extends JpaRepository<AttemptedExams, Long> {
    public void deleteById(int id);
    public AttemptedExams findById(int id);

    public void deleteByExamId(int id);
}

package com.example.PlacePrep.service;

import com.example.PlacePrep.model.Question;
import com.example.PlacePrep.model.User;
import com.example.PlacePrep.repository.QuestionRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @GetMapping
    public Iterable<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    @PostMapping
        public void saveQuestion(Question question) {
            questionRepository.save(question);
        }

    @PutMapping
    public void updateQuestion(Question question,int id) {
        Question question1 = questionRepository.findById(id);
        question1.setQuesdesc(question.getQuesdesc());
        question1.setOption1(question.getOption1());
        question1.setOption2(question.getOption2());
        question1.setOption3(question.getOption3());
        question1.setOption4(question.getOption4());
        question1.setAnswer(question.getAnswer());
        question1.setType(question.getType());
        question1.setDifficulty(question.getDifficulty());
        questionRepository.save(question1);
    }

    @DeleteMapping
    public void deleteQuestion(int id) {
        questionRepository.delete(questionRepository.findById(id));
    }


    public void saveQuestionFromExcel(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            List<Question> questions = new ArrayList<>();

            int startRow = 1;

            for (int i = startRow; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                try {
                    Question question = new Question();
                    question.setQuesdesc(getCellValueAsString(row.getCell(0)));
                    question.setOption1(getCellValueAsString(row.getCell(1)));
                    question.setOption2(getCellValueAsString(row.getCell(2)));
                    question.setOption3(getCellValueAsString(row.getCell(3)));
                    question.setOption4(getCellValueAsString(row.getCell(4)));
                    question.setAnswer(getCellValueAsString(row.getCell(5)));
                    question.setType(getCellValueAsString(row.getCell(6)));
                    question.setDifficulty(getCellValueAsString(row.getCell(7)));

                    questions.add(question);
                } catch (Exception e) {
                    throw new IOException("Error at row " + (i + 1) + ": " + e.getMessage());
                }
            }

            if (!questions.isEmpty()) {
                questionRepository.saveAll(questions);
            }
        }
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return "";
        }

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf(cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case BLANK:
                return "";
            default:
                return "";
        }
    }
}

package com.example.PlacePrep.service;


import com.example.PlacePrep.model.User;
import com.example.PlacePrep.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class UserService {

    @Autowired
    private JWTService jwtService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public void saveUser(User user) {
        user.setCreated_at(LocalDateTime.now());
        user.setUpdated_at(LocalDateTime.now());
        user.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public void updateUser(User user, int id) {
        User user1 = userRepository.findById(id);
        user1.setUsername(user.getUsername());
        user1.setPassword(user.getPassword());
        user1.setEmail(user.getEmail());
        user1.setFirstname(user.getFirstname());
        user1.setLastname(user.getLastname());
        user1.setRole(user.getRole());
        user1.setUpdated_at(LocalDateTime.now());
        userRepository.save(user1);
    }

    public void saveUserFromExcel(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            List<User> users = new ArrayList<>();

            int startRow = 1;

            for (int i = startRow; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                try {
                    User user = new User();
                    user.setUsername(getCellValueAsString(row.getCell(0)));
                    user.setPassword(getCellValueAsString(row.getCell(1)));
                    user.setEmail(getCellValueAsString(row.getCell(2)));
                    user.setFirstname(getCellValueAsString(row.getCell(3)));
                    user.setLastname(getCellValueAsString(row.getCell(4)));
                    user.setRole(getCellValueAsString(row.getCell(5)));
                    user.setCreated_at(LocalDateTime.now());
                    user.setUpdated_at(LocalDateTime.now());

                    users.add(user);
                } catch (Exception e) {
                    throw new IOException("Error at row " + (i + 1) + ": " + e.getMessage());
                }
            }

            if (!users.isEmpty()) {
                userRepository.saveAll(users);
            }
        }
    }

    // Helper method to safely get cell values
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
    public void deleteUser(int id) {
        userRepository.delete(userRepository.findById(id));
    }
    public Iterable<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public String verify(User user) {
        User user1 = getUserByUsername(user.getUsername());
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(user.getUsername(),user1.getRole());
        } else {
            return "fail";
        }
    }
}

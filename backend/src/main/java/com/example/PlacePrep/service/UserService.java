package com.example.PlacePrep.service;


import com.example.PlacePrep.model.User;
import com.example.PlacePrep.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
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

    public void updateUser(User user, String username) {
        User user1 = userRepository.findByUsername(username);
        user1.setUsername(user.getUsername());
        user1.setPassword(user.getPassword());
        user1.setEmail(user.getEmail());
        user1.setFirstname(user.getFirstname());
        user1.setLastname(user.getLastname());
        user1.setRole(user.getRole());
        user1.setUpdated_at(LocalDateTime.now());
        userRepository.save(user1);
    }

    public void saveUserFromExcel(MultipartFile file) throws IOException{
        Workbook workbook = new XSSFWorkbook(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);
        List<User> users = new ArrayList<>();
        for(int i = 0; i < sheet.getPhysicalNumberOfRows(); i++) {
            User user = new User();
            user.setUsername(sheet.getRow(i).getCell(0).getStringCellValue());
            user.setPassword(sheet.getRow(i).getCell(1).getStringCellValue());
            user.setEmail(sheet.getRow(i).getCell(2).getStringCellValue());
            user.setFirstname(sheet.getRow(i).getCell(3).getStringCellValue());
            user.setLastname(sheet.getRow(i).getCell(4).getStringCellValue());
            user.setRole(sheet.getRow(i).getCell(5).getStringCellValue());
            user.setCreated_at(LocalDateTime.now());
            user.setUpdated_at(LocalDateTime.now());
            users.add(user);
        }
        userRepository.saveAll(users);
    }
    public void deleteUser(String username) {
        userRepository.delete(userRepository.findByUsername(username));
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

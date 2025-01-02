package com.example.PlacePrep.service;


import com.example.PlacePrep.dto.UserLogDTO;
import com.example.PlacePrep.model.User;
import com.example.PlacePrep.model.UserLog;
import com.example.PlacePrep.repository.UserLogRepository;
import com.example.PlacePrep.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDateTime;

@Service
@Slf4j
public class UserLogService {

    @Autowired
    private UserLogRepository userLogRepository;

    @Autowired
    private UserRepository userRepository;

    public void save(UserLogDTO userLogdto)
    {
        User user = userRepository.findById(userLogdto.getUserId());
        UserLog userLog = new UserLog();
        userLog.setUser(user);
        userLog.setLoginTime(LocalDateTime.now());
        userLogRepository.save(userLog);
    }

    public Iterable<UserLog> findAll()
    {
        return userLogRepository.findAll();
    }
}

package com.example.PlacePrep.controller;


import com.example.PlacePrep.dto.UserLogDTO;
import com.example.PlacePrep.service.UserLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/userlog")
@CrossOrigin(origins = {"http://localhost:5173/","http://localhost:5173/admin"})
public class UserLogController {

    @Autowired
    private UserLogService userLogService;


    @GetMapping
    public ResponseEntity<?> findAll()
    {
        return ResponseEntity.ok(userLogService.findAll());
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody UserLogDTO userLogDTO) {
        userLogService.save(userLogDTO);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}

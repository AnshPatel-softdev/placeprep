package com.example.PlacePrep.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserLogDTO {
    public int userId;
    public LocalDateTime loginTime;
}

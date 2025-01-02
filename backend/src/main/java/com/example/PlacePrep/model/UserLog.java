package com.example.PlacePrep.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "userlog")
public class UserLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "userid", nullable = false, referencedColumnName = "id")
    private User user;

    @Column(name = "login_time" , nullable = false)
    private LocalDateTime loginTime;
}

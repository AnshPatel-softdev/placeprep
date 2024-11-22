package com.example.PlacePrep;

import org.apache.catalina.filters.CorsFilter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@SpringBootApplication
@EnableTransactionManagement
public class PlacePrepApplication {

	public static void main(String[] args) {
		SpringApplication.run(PlacePrepApplication.class, args);
	}

}
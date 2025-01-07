# Online Exam Platform

An online examination platform that allows examiners to create exams with MCQ and programming sections, manage examinees, and review results. Built with a Spring Boot backend, a React.js frontend, and SQL Express for data storage, the platform supports role-based authentication and secure exam administration.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)


## Features

- *Role-based authentication*: Separate roles for Examiner and Examinee with controlled access.
- *Examiner functionalities*:
  - Register, login, and manage examinees
  - Create exams with multiple-choice and coding questions
  - Monitor examinee progress and view results
- *Examinee functionalities*:
  - Login and access assigned exams
  - Complete MCQ and programming sections within a given time
- *Real-time results*

## Tech Stack

- *Frontend*: React.js, Tailwind CSS (optional for styling)
- *Backend*: Spring Boot, Java
- *Database*: SQL Server (Express)

## Getting Started

To set up and run this project locally, follow these instructions.

### Prerequisites

- *Java Development Kit (JDK)* 11 or higher
- *npm* (for React frontend)
- *SQL Server Express* for the database
- *Spring Boot* for the backend

### Installation

1. *Clone the Repository*

   First, clone the project repository from GitHub to your local machine:

   bash
   git clone https://github.com/AnshPatel-softdev/placeprep.git
   
   cd placeprep

2 Backend Setup (Spring Boot)

- Open the backend code in an IDE such as IntelliJ IDEA or Eclipse.
-  Go to `src/main/resources` and open the `application.properties` file. Configure it to match your local database setup:
   properties
   
   spring.datasource.url=jdbc:sqlserver://localhost:your-tcp-port;databaseName=your-database-name
   
   spring.datasource.username=your-username
   
   spring.datasource.password=your-password
   
   spring.jpa.hibernate.ddl-auto=update
   
- Start the Application


3 Frontend Setup (React)

1. Navigate to the frontend directory, install dependencies, and start the frontend server:
   ```bash
   cd frontend
   npm install
   npm start

  ### Data
  https://drive.google.com/drive/u/0/folders/11sfgCBbEKtW1fINm9AGNMfi14QlU1XaE

### Running the Application

1. Start the Spring Boot backend by running the main application class in your IDE.
2. Start the React frontend by running npm start in the frontend directory.

Once both are running, you should be able to access the application at [http://localhost:5173].

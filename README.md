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

  ### Database Setup

1. Open SQL Server Management Studio (SSMS).
2. Create a database named placeprep.
3. Run This scripts
   
USE [placeprep]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[users](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[username] [varchar](50) NOT NULL,
	[password] [varchar](50) NOT NULL,
	[email] [varchar](50) NOT NULL,
	[firstname] [varchar](50) NOT NULL,
	[lastname] [varchar](50) NOT NULL,
	[created_at] [datetime] NOT NULL,
	[updated_at] [datetime] NOT NULL,
	[role] [varchar](50) NOT NULL
) ON [PRIMARY]
GO

SET IDENTITY_INSERT [dbo].[users] ON 
GO

INSERT [dbo].[users] ([id], [username], [password], [email], [firstname], [lastname], [created_at], [updated_at], [role]) VALUES (1, N'ansh', N'ansh@2704', N'a1@gmail.com', N'Ansh', N'Patel', CAST(N'2024-10-31T13:00:43.943' AS DateTime), CAST(N'2024-10-31T13:00:43.943' AS DateTime), N'ADMIN')
GO

INSERT [dbo].[users] ([id], [username], [password], [email], [firstname], [lastname], [created_at], [updated_at], [role]) VALUES (2, N'mahavir', N'mahavir2010', N'm1@gmail.com', N'Mahavir', N'Patel', CAST(N'2024-10-31T16:21:26.970' AS DateTime), CAST(N'2024-10-31T16:21:26.970' AS DateTime), N'STUDENT')
GO

INSERT [dbo].[users] ([id], [username], [password], [email], [firstname], [lastname], [created_at], [updated_at], [role]) VALUES (3, N'nisarg', N'njp14', N'n1@gmail.com', N'Nisarg', N'Patel', CAST(N'2024-11-01T09:11:21.280' AS DateTime), CAST(N'2024-11-01T09:11:21.280' AS DateTime), N'STUDENT')
GO

SET IDENTITY_INSERT [dbo].[users] OFF
GO


### Running the Application

1. Start the Spring Boot backend by running the main application class in your IDE.
2. Start the React frontend by running npm start in the frontend directory.

Once both are running, you should be able to access the application at [http://localhost:5173].

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/Admin';
import StudentDashboard from './components/Student';
import ExamPagination from './components/ExamPagination';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentExam, setCurrentExam] = useState(null);
  const [currentQuestions, setCurrentQuestions] = useState([]);

  const handleNavigation = (user) => {
    setCurrentUser(user);
  };

  const handleStartExam = (exam, questions) => {
    setCurrentExam(exam);
    setCurrentQuestions(questions);
  };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login onLoginSuccess={handleNavigation} />} />
          <Route 
            path="/admin" 
            element={currentUser?.role === 'ADMIN' ? 
              <AdminDashboard user={currentUser}/> : 
              <Navigate to="/" />
            } 
          />
          <Route 
            path="/student" 
            element={currentUser?.role === 'STUDENT' ? 
              <StudentDashboard 
                user={currentUser} 
                onStartExam={handleStartExam} 
              /> : 
              <Navigate to="/" />
            } 
          />
          <Route 
            path="/exam" 
            element={currentUser?.role === 'STUDENT' && currentExam ? (
              <ExamPagination 
                exam={currentExam} 
                questions={currentQuestions}
                user={currentUser}
              />
            ) : (
              <Navigate to="/student" />
            )} 
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
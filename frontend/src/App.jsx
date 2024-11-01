import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/Admin';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const handleNavigation = (user) => {
    setCurrentUser(user);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLoginSuccess={handleNavigation} />} />
        <Route path="/admin" element={currentUser?.role === 'ADMIN' ? <AdminDashboard user={currentUser} /> : <Navigate to="/" />} />
        <Route path="/student" element={currentUser?.role === 'STUDENT' ? (<div className="p-6">
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <p>Welcome, {currentUser?.username}!</p>
        </div>) : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;

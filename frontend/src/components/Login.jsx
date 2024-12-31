import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {useNavigate} from 'react-router-dom'

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const token = await fetch('http://localhost:8081/user/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username: username, password: password })
      })
      .then(response => response.text())
      .then(body => {
          console.log('Response Body:', body);
          return body;
      })
      .catch(error => {
          console.error('Error fetching token:', error);
          throw new Error('Failed to fetch token');
      });
  
      const response = await fetch(`http://localhost:8081/user/${username}`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      })
      .then(response => {
          if (response.ok) {
              return response.json();
          }
          throw new Error("Network response was not ok.");
      })
      .then(data => {
          return data;
      })
      .catch(error => {
          console.error("There was a problem with the fetch operation:", error);
          throw new Error("Failed to authenticate request");
      });
      response.token = token
      onLoginSuccess(response);
  
      if (response.role === 'ADMIN') {
          navigate('/admin');
      } else if (response.role === 'STUDENT') {
          navigate('/student');
      } else {
          setError("Password is incorrect");
      }
  
  } catch (err) {
      setError(err.message);
  }  
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default Login;
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';

const AdminDashboard = ({ user }) => {
    const [showUserForm, setShowUserForm] = useState(false);
    const [showQuestionForm, setShowQuestionForm] = useState(false);

    const [userData, setUserData] = useState({
      username: '',
      password: '',
      role: 'STUDENT',
      email: '',
      firstname: '',
      lastname: '',
      created_at: '',
      updated_at: '',
    });

    const [questionData, setQuestionData] = useState({
      quesdesc: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      answer: '',
      type: '',
      difficulty: 'easy',
    });

    const handleUserSubmit = async (e) => {
      e.preventDefault();
      console.log(formData)
      console.log(user.token)
      try {
        const response = await fetch('http://localhost:8081/user/save', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${user.token}`, // Use the token here
            'Content-Type': 'application/json'
        },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Failed to create user');
        setShowForm(false);
        setFormData({
          username: '',
          password: '',
          role: 'STUDENT',
          email: '',
          firstname:'',
          lastname:'',
          created_at:'',
          updated_at:'',
        });
      } catch (err) {
        console.error('Error creating user:', err);
      }
    };

    const handleQuestionSubmit = async (e) => {
      e.preventDefault();
      console.log(user.token)
      try {
        const response = await fetch('http://localhost:8081/question', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(questionData),
        });
        if (!response.ok) throw new Error('Failed to create question');
        setShowQuestionForm(false);
        setQuestionData({
          quesdesc: '',
          option1: '',
          option2: '',
          option3: '',
          option4: '',
          answer: '',
          type: '',
          difficulty: 'easy',
        });
      } catch (err) {
        console.error('Error creating question:', err);
      }
    };

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <p className="mb-4">Welcome, {user?.username}!</p>

        <div className="space-y-4">
          <Button onClick={() => setShowUserForm(!showUserForm)}>
            {showUserForm ? 'Cancel' : 'Add New User'}
          </Button>

          <Button className="ml-5" onClick={() => setShowQuestionForm(!showQuestionForm)}>
            {showQuestionForm ? 'Cancel' : 'Add New Question'}
          </Button>

          {/* Add User Form */}
          {showUserForm && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Add New User</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUserSubmit} className="space-y-4">
                  <Input
                    placeholder="Username"
                    value={userData.username}
                    onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={userData.password}
                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                  />
                  <Select
                    value={userData.role}
                    onValueChange={(value) => setUserData({ ...userData, role: value })}
                  >
                    <SelectTrigger>Role</SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STUDENT">Student</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  />
                  <Input
                    placeholder="First Name"
                    value={userData.firstname}
                    onChange={(e) => setUserData({ ...userData, firstname: e.target.value })}
                  />
                  <Input
                    placeholder="Last Name"
                    value={userData.lastname}
                    onChange={(e) => setUserData({ ...userData, lastname: e.target.value })}
                  />
                  <Button type="submit">Create User</Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Add Question Form */}
          {showQuestionForm && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Add New Question</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleQuestionSubmit} className="space-y-4">
                  <Input
                    placeholder="Question Description"
                    value={questionData.quesdesc}
                    onChange={(e) => setQuestionData({ ...questionData, quesdesc: e.target.value })}
                  />
                  <Input
                    placeholder="Option 1"
                    value={questionData.option1}
                    onChange={(e) => setQuestionData({ ...questionData, option1: e.target.value })}
                  />
                  <Input
                    placeholder="Option 2"
                    value={questionData.option2}
                    onChange={(e) => setQuestionData({ ...questionData, option2: e.target.value })}
                  />
                  <Input
                    placeholder="Option 3"
                    value={questionData.option3}
                    onChange={(e) => setQuestionData({ ...questionData, option3: e.target.value })}
                  />
                  <Input
                    placeholder="Option 4"
                    value={questionData.option4}
                    onChange={(e) => setQuestionData({ ...questionData, option4: e.target.value })}
                  />
                  <Input
                    placeholder="Answer"
                    value={questionData.answer}
                    onChange={(e) => setQuestionData({ ...questionData, answer: e.target.value })}
                  />
                  <Input
                    placeholder="Type"
                    value={questionData.type}
                    onChange={(e) => setQuestionData({ ...questionData, type: e.target.value })}
                  />
                  <Select
                    value={questionData.difficulty}
                    onValueChange={(value) => setQuestionData({ ...questionData, difficulty: value })}
                  >
                    <SelectTrigger>Difficulty</SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="submit">Add Question</Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
};

export default AdminDashboard;

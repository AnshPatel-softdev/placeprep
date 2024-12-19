import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const ShowAttemptedQuestionsModel = ({ user }) => {
  const [attemptedQuestions, setAttemptedQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [exams, setExams] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchAttemptedQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:8081/attempted_question', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        setAttemptedQuestions(response.data);
        setFilteredQuestions(response.data);

        const uniqueExams = [...new Set(response.data.map(q => q.exam.exam_name))];
        const uniqueUsers = [...new Set(response.data.map(q => q.user.username))];
        
        setExams(uniqueExams);
        setUsers(uniqueUsers);
      } catch (error) {
        console.error('Error fetching attempted questions:', error);
      }
    };

    fetchAttemptedQuestions();
  }, [user.token]);

  useEffect(() => {
    let filtered = attemptedQuestions;

    if (selectedExam) {
      filtered = filtered.filter(q => q.exam.exam_name === selectedExam);
    }

    if (selectedUser) {
      filtered = filtered.filter(q => q.user.username === selectedUser);
    }

    setFilteredQuestions(filtered);
  }, [selectedExam, selectedUser, attemptedQuestions]);

  const resetFilters = () => {
    setSelectedExam('');
    setSelectedUser('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attempted Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-4">
          <div className="w-1/2">
            <label className="block mb-2">Filter by Exam</label>
            <Select 
              value={selectedExam} 
              onValueChange={setSelectedExam}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Exam" />
              </SelectTrigger>
              <SelectContent>
                {exams.map(exam => (
                  <SelectItem key={exam} value={exam}>{exam}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-1/2">
            <label className="block mb-2">Filter by User</label>
            <Select 
              value={selectedUser} 
              onValueChange={setSelectedUser}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select User" />
              </SelectTrigger>
              <SelectContent>
                {users.map(username => (
                  <SelectItem key={username} value={username}>{username}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {selectedExam || selectedUser ? (
          <button 
            onClick={resetFilters} 
            className="mb-4 text-blue-600 hover:underline"
          >
            Clear Filters
          </button>
        ) : null}

        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Exam</TableCell>
              <TableCell>Question</TableCell>
              <TableCell>Selected Option</TableCell>
              <TableCell>Correct Answer</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.user.username}</TableCell>
                <TableCell>{item.exam.exam_name}</TableCell>
                <TableCell>{item.question.quesdesc}</TableCell>
                <TableCell>{item.selectedOption}</TableCell>
                <TableCell>{item.question.answer}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredQuestions.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No attempted questions found.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ShowAttemptedQuestionsModel;
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

const ShowAttemptedQuestionsModel = ({ user }) => {
  const [attemptedQuestions, setAttemptedQuestions] = useState([]);

  useEffect(() => {
    const fetchAttemptedQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:8081/attempted_question', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        setAttemptedQuestions(response.data);
      } catch (error) {
        console.error('Error fetching attempted questions:', error);
      }
    };

    fetchAttemptedQuestions();
  }, [user.token]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Attempted Questions</CardTitle>
      </CardHeader>
      <CardContent>
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
            {attemptedQuestions.map(item => (
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

        {attemptedQuestions.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No attempted questions found.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ShowAttemptedQuestionsModel;
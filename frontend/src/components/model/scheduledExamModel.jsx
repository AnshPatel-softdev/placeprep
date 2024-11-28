import React, { useState, useEffect } from 'react';
import { format, isWithinInterval, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, Calendar, School, BookOpen, Award } from "lucide-react";

const ScheduledExams = ({user,onStartExam}) => {
  const [exams, setExams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
    fetchQuestions();
    console.log(questions)
  }, []);

  const fetchExams = async () => {
    try {
      const response = await fetch('http://localhost:8081/exam', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        }
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setExams(data);
      
    } catch (err) {
      setError('Failed to fetch exams');
      console.error('Error fetching exams:', err);
    } finally {
      setLoading(false);
    }
  };
  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:8081/question', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      
      const data = await response.json();
      setQuestions(data);
      
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  const handleAttemptExam = (exam) => {    
    onStartExam(exam, questions);

    navigate('/exam');
  };

  const combineDateTime = (date, time) => {
    return `${date}T${time}`;
  };

  const isExamAccessible = (startDate, startTime, endDate, endTime) => {
    const now = new Date();
    const examStart = new Date(combineDateTime(startDate, startTime));
    const examEnd = new Date(combineDateTime(endDate, endTime));

    return isWithinInterval(now, {
      start: examStart,
      end: examEnd
    });
  };

  const getExamStatus = (startDate, startTime, endDate, endTime) => {
    const now = new Date();
    const examStart = new Date(combineDateTime(startDate, startTime));
    const examEnd = new Date(combineDateTime(endDate, endTime));

    if (now < examStart) {
      return "Upcoming";
    } else if (now > examEnd) {
      return "Expired";
    } else {
      return "In Progress";
    }
  };


  if (loading) {
    return <div className="text-center p-4">Loading exams...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Scheduled Exams</h2>
      
      {exams.map((exam) => (
        <Card key={exam.id} className="w-full">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{exam.exam_name}</CardTitle>
                <CardDescription className="mt-2">
                  <div className="flex items-center space-x-2">
                    <School className="h-4 w-4" />
                    <span>{exam.college}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{exam.branch} - Semester {exam.semester}</span>
                  </div>
                </CardDescription>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium
                  ${getExamStatus(exam.exam_start_date, exam.exam_start_time, exam.exam_end_date, exam.exam_end_time) === 'In Progress' 
                    ? 'bg-green-100 text-green-800'
                    : getExamStatus(exam.exam_start_date, exam.exam_start_time, exam.exam_end_date, exam.exam_end_time) === 'Upcoming'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-red-100 text-red-800'
                  }`}>
                  {getExamStatus(exam.exam_start_date, exam.exam_start_time, exam.exam_end_date, exam.exam_end_time)}
                </span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  Start: {format(new Date(combineDateTime(exam.exam_start_date, exam.exam_start_time)), 'PPp')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  End: {format(new Date(combineDateTime(exam.exam_end_date, exam.exam_end_time)), 'PPp')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  Duration: {exam.duration} minutes
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span className="text-sm">
                  Total Marks: {exam.total_marks}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Questions</TableCell>
                    <TableCell>{exam.no_of_questions}</TableCell>
                    <TableCell className="font-medium">Passing Marks</TableCell>
                    <TableCell>{exam.passing_marks}</TableCell>
                    <TableCell className="font-medium">Total Marks</TableCell>
                    <TableCell>{exam.total_marks}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Created</TableCell>
                    <TableCell>
                      {format(parseISO(exam.created_at), 'PPp')}
                    </TableCell>
                    <TableCell className="font-medium">Last Updated</TableCell>
                    <TableCell>
                      {format(parseISO(exam.updated_at), 'PPp')}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>

          <CardFooter>
          <Button
            onClick={() => handleAttemptExam(exam)}
            disabled={!isExamAccessible(exam.exam_start_date, exam.exam_start_time, 
                                      exam.exam_end_date, exam.exam_end_time)}
            className="w-full"
          >
              {isExamAccessible(exam.exam_start_date, exam.exam_start_time, 
                              exam.exam_end_date, exam.exam_end_time)
                ? "Attempt Exam"
                : getExamStatus(exam.exam_start_date, exam.exam_start_time, 
                              exam.exam_end_date, exam.exam_end_time) === "Expired"
                ? "Exam Ended"
                : "Not Started Yet"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ScheduledExams;
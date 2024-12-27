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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, Calendar, School, BookOpen, Award, Filter, AlertCircle } from "lucide-react";

const ScheduledExams = ({user, onStartExam}) => {
  const [exams, setExams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    examName: '',
    examStatus: 'IN_PROGRESS',
    startDate: '',
    college: user.college || '',
    semester: user.semester || '',
    branch: user.branch || ''
  });

  useEffect(() => {
    fetchExams();
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

  const fetchQuestions = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/exam/${parseInt(id)}`, {
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
      return data;
      
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to fetch exam questions');
    }
  };

  const fetchProgrammingQuestions = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/exam/programming/${parseInt(id)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch programming questions');
      }
      return await response.json();
      
    } catch (err) {
      console.error('Error fetching programming questions:', err);
      throw new Error('Failed to fetch programming questions');
    }
  };

  const handleAttemptExam = async (exam) => {    
    try {
      const [regularQuestions, programmingQuestions] = await Promise.all([
        fetchQuestions(exam.id),
        fetchProgrammingQuestions(exam.id)
      ]);
      
      const data = {regularQuestions,programmingQuestions}
      console.log(data)
      onStartExam(exam, data);
      navigate('/exam');
    } catch (err) {
      setError('Unable to start exam. Please try again.');
    }
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

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }));
  };

  const filteredExams = exams.filter(exam => {
    const matchesCriteria = 
      exam.college === user.college &&
      exam.semester === user.semester  
    const matchesName = 
      !filters.examName || 
      exam.exam_name.toLowerCase().includes(filters.examName.toLowerCase());
  
    const currentStatus = getExamStatus(
      exam.exam_start_date, 
      exam.exam_start_time, 
      exam.exam_end_date, 
      exam.exam_end_time
    );
  
    const matchesStatus = 
      filters.examStatus === 'ALL' || 
      (filters.examStatus === 'IN_PROGRESS' && currentStatus === 'In Progress') ||
      (filters.examStatus === 'UPCOMING' && currentStatus === 'Upcoming') ||
      (filters.examStatus === 'EXPIRED' && currentStatus === 'Expired');
  
    const matchesStartDate = 
      !filters.startDate || 
      new Date(exam.exam_start_date) >= new Date(filters.startDate);
  
    return matchesCriteria && matchesName && matchesStatus && matchesStartDate;
  });

  const getExamStatusColor = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-green-100 text-green-800';
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin">
          <Clock className="h-8 w-8 text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <h2 className="text-2xl font-bold mb-4">Scheduled Exams</h2>
      
      <div className="grid grid-cols-4 gap-4 mb-4">
        <Input 
          placeholder="Exam Name" 
          value={filters.examName}
          onChange={(e) => handleFilterChange('examName', e.target.value)}
          className="w-full"
        />
        <Input 
          type="date"
          placeholder="Start Date" 
          value={filters.startDate}
          onChange={(e) => handleFilterChange('startDate', e.target.value)}
          className="w-full"
        />
        <Select 
          value={filters.examStatus}
          onValueChange={(value) => handleFilterChange('examStatus', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Exam Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="UPCOMING">Upcoming</SelectItem>
            <SelectItem value="EXPIRED">Expired</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="w-full">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </div>
      
      {filteredExams.length === 0 ? (
        <div className="text-center text-gray-500 p-4">
          No exams match the current filters.
        </div>
      ) : (
        filteredExams.map((exam) => (
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
                  <span 
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      getExamStatusColor(
                        getExamStatus(
                          exam.exam_start_date, 
                          exam.exam_start_time, 
                          exam.exam_end_date, 
                          exam.exam_end_time
                        )
                      )
                    }`}
                  >
                    {getExamStatus(
                      exam.exam_start_date, 
                      exam.exam_start_time, 
                      exam.exam_end_date, 
                      exam.exam_end_time
                    )}
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
                  </TableBody>
                </Table>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                onClick={() => handleAttemptExam(exam)}
                disabled={!isExamAccessible(
                  exam.exam_start_date, 
                  exam.exam_start_time, 
                  exam.exam_end_date, 
                  exam.exam_end_time
                )}
                className="w-full"
              >
                {isExamAccessible(
                  exam.exam_start_date, 
                  exam.exam_start_time, 
                  exam.exam_end_date, 
                  exam.exam_end_time
                )
                  ? "Attempt Exam"
                  : getExamStatus(
                      exam.exam_start_date, 
                      exam.exam_start_time, 
                      exam.exam_end_date, 
                      exam.exam_end_time
                    ) === "Expired"
                  ? "Exam Ended"
                  : "Not Started Yet"}
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default ScheduledExams;
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ExamPagination = ({ exam, questions, user }) => {
  // Randomly select questions only once when the component is first loaded
  const examQuestions = useMemo(() => {
    // Create a copy of the questions to avoid mutating the original array
    const questionsCopy = [...questions];
    const selectedQuestions = [];

    // Ensure we don't select more questions than available
    const selectCount = Math.min(exam.no_of_questions, questionsCopy.length);

    while (selectedQuestions.length < selectCount) {
      // Generate a random index
      const randomIndex = Math.floor(Math.random() * questionsCopy.length);
      
      // Remove the selected question and add it to our selected questions
      const [selectedQuestion] = questionsCopy.splice(randomIndex, 1);
      selectedQuestions.push(selectedQuestion);
    }

    return selectedQuestions;
  }, [questions, exam.no_of_questions]); // Only recompute if questions or number of questions changes

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(exam.duration * 60);
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const preventCopyPaste = (e) => {
      e.preventDefault();
      setAlertMessage({
        message: "Copy and paste are not allowed during the exam.",
        type: 'error'
      });
    };

    document.addEventListener('copy', preventCopyPaste);
    document.addEventListener('cut', preventCopyPaste);
    document.addEventListener('paste', preventCopyPaste);

    return () => {
      document.removeEventListener('copy', preventCopyPaste);
      document.removeEventListener('cut', preventCopyPaste);
      document.removeEventListener('paste', preventCopyPaste);
    };
  }, []);

  useEffect(() => {
    if (timeRemaining > 0 && !isExamCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleSubmitExam();
    }
  }, [timeRemaining, isExamCompleted]);

  useEffect(() => {
    const preventContextMenu = (e) => {
      e.preventDefault();
      setAlertMessage({
        message: "Right-click is not allowed during the exam.",
        type: 'error'
      });
    };

    document.addEventListener('contextmenu', preventContextMenu);
    
    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: option
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(answers[currentQuestionIndex + 1] || null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(answers[currentQuestionIndex - 1] || null);
    }
  };

  const handleSubmitExam = useCallback(async () => {
    if (isSubmitting || isExamCompleted) return;

    try {
      setIsSubmitting(true);

      let correctCount = 0;
      examQuestions.forEach((question, index) => {
        if (answers[index] === question.answer) {
          correctCount++;
        }
      });

      const status = correctCount >= exam.passing_marks ? 'Pass' : 'Fail';

      const examResultData = {
        userId: parseInt(user.id),
        examId: parseInt(exam.id),
        examDate: new Date().toISOString().split("T")[0],
        examTime: new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        submittedDate: new Date().toISOString().split("T")[0],
        submittedTime: new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        obtainedMarks: correctCount,
        totalMarks: examQuestions.length,
        passingMarks: exam.passing_marks,
        passingStatus: status,
      };

      await axios.post('http://localhost:8081/attemptedexam', examResultData, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      setIsExamCompleted(true);

      setAlertMessage({
        message: `You ${status}ed the exam. Marks: ${correctCount}/${examQuestions.length}`, 
        type: status === 'Pass' ? 'success' : 'error'
      });

    } catch (error) {
      setAlertMessage({
        message: "Failed to submit exam. Please try again.", 
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting, 
    isExamCompleted, 
    answers, 
    examQuestions, 
    exam, 
    user
  ]);

  if (isExamCompleted) {
    return (
      <Card className="max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle>Exam Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Thank you for taking the exam.</p>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = examQuestions[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto p-4">
      {alertMessage && (
        <Alert 
          variant={
            alertMessage.type === 'error' ? 'destructive' : 
            alertMessage.type === 'success' ? 'default' : 
            'outline'
          } 
          className="mb-4"
        >
          <AlertDescription>
            {alertMessage.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="text-right mb-4 font-bold text-red-600">
        Time Remaining: {formatTime(timeRemaining)}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Question {currentQuestionIndex + 1} of {examQuestions.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{currentQuestion.quesdesc}</p>

          <div className="space-y-2">
            {['option1', 'option2', 'option3', 'option4'].map((optionKey) => (
              <Button
                key={optionKey}
                variant={selectedOption === currentQuestion[optionKey] ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => handleOptionSelect(currentQuestion[optionKey])}
              >
                {currentQuestion[optionKey]}
              </Button>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            {currentQuestionIndex > 0 && (
              <Button variant="secondary" onClick={handlePreviousQuestion}>
                Previous
              </Button>
            )}
            
            {currentQuestionIndex < examQuestions.length - 1 ? (
              <Button 
                onClick={handleNextQuestion} 
                disabled={!selectedOption}
                className="ml-auto"
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmitExam} 
                disabled={!selectedOption || isSubmitting}
                className="ml-auto"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Exam'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamPagination;
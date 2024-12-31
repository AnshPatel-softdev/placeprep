import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Editor from '@monaco-editor/react';

const ExamPagination = ({ exam, questions, user }) => {
  const regularQuestions = questions.regularQuestions.map(q => q.question);
  const programmingQuestions = questions.programmingQuestions;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(exam.duration * 60);
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProgrammingSection, setShowProgrammingSection] = useState(false);
  const [currentProgrammingIndex, setCurrentProgrammingIndex] = useState(0);
  const [programmingAnswers, setProgrammingAnswers] = useState({});
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

  const saveQuestionAttempt = async (questionId, selectedOption) => {
    try {
      const attemptData = {
        userId: parseInt(user.id),
        examId: parseInt(exam.id),
        questionId: questionId,
        selectedOption: selectedOption
      };

      await axios.post('http://localhost:8081/attempted_question', attemptData, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
    } catch (error) {
      console.error('Failed to save question attempt:', error);
      setAlertMessage({
        message: "Failed to save question attempt.",
        type: 'error'
      });
    }
  };

  const saveProgrammingAttempt = async () => {
    try {
      // Save all programming answers
      for (const [index, code] of Object.entries(programmingAnswers)) {
        const programmingAttemptData = {
          userId: parseInt(user.id),
          examId: parseInt(exam.id),
          programmingQuestionId: programmingQuestions[parseInt(index)].id,
          answer: code
        };

        await axios.post('http://localhost:8081/attempted_programming_question', programmingAttemptData, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
      }
    } catch (error) {
      console.error('Failed to save programming attempt:', error);
      setAlertMessage({
        message: "Failed to save programming attempt.",
        type: 'error'
      });
    }
  };

  const updateQuestionAttempt = async (questionId, selectedOption) => {
    try {
      const updateData = {
        userId: parseInt(user.id),
        examId: parseInt(exam.id),
        questionId: questionId,
        selectedOption: selectedOption
      };

      await axios.put('http://localhost:8081/attempted_question', updateData, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
    } catch (error) {
      console.error('Failed to update question attempt:', error);
      setAlertMessage({
        message: "Failed to update question attempt.",
        type: 'error'
      });
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = async (option) => {
    const currentQuestion = regularQuestions[currentQuestionIndex];
    
    if (!answers[currentQuestionIndex]) {
      await saveQuestionAttempt(currentQuestion.id, option);
    } else if (answers[currentQuestionIndex] !== option) {
      await updateQuestionAttempt(currentQuestion.id, option);
    }

    setSelectedOption(option);
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: option
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < regularQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(answers[currentQuestionIndex + 1] || null);
    } else if (currentQuestionIndex === regularQuestions.length - 1 && programmingQuestions.length > 0) {
      setShowProgrammingSection(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (showProgrammingSection) {
      setShowProgrammingSection(false);
      setCurrentQuestionIndex(regularQuestions.length - 1);
    } else if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(answers[currentQuestionIndex - 1] || null);
    }
  };
  const handleCodeChange = (value) => {
    setProgrammingAnswers(prev => ({
      ...prev,
      [currentProgrammingIndex]: value
    }));
  };

  const handleNextProgrammingQuestion = () => {
    if (currentProgrammingIndex < programmingQuestions.length - 1) {
      setCurrentProgrammingIndex(prev => prev + 1);
    }
  };

  const handlePreviousProgrammingQuestion = () => {
    if (currentProgrammingIndex > 0) {
      setCurrentProgrammingIndex(prev => prev - 1);
    } else {
      setShowProgrammingSection(false);
      setCurrentQuestionIndex(regularQuestions.length - 1);
    }
  };
  const handleSubmitExam = useCallback(async () => {
    if (isSubmitting || isExamCompleted) return;

    try {
      setIsSubmitting(true);

      if (programmingQuestions.length > 0) {
        await saveProgrammingAttempt();
      }

      let correctCount = 0;
      regularQuestions.forEach((question, index) => {
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
        totalMarks: regularQuestions.length,
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
        message: `You ${status}ed the exam. Marks: ${correctCount}/${regularQuestions.length}`,
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
    regularQuestions,
    programmingQuestions,
    programmingAnswers,
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

  if (showProgrammingSection && programmingQuestions.length > 0) {
    const currentProgrammingQuestion = programmingQuestions[currentProgrammingIndex];
    
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-right mb-4 font-bold text-red-600">
          Time Remaining: {formatTime(timeRemaining)}
        </div>

        {alertMessage && (
          <Alert 
            variant={alertMessage.type === 'error' ? 'destructive' : 'default'} 
            className="mb-4"
          >
            <AlertDescription>{alertMessage.message}</AlertDescription>
          </Alert>
        )}

        <div className="mb-4">
          <h2 className="text-xl font-bold">
            Programming Question {currentProgrammingIndex + 1} of {programmingQuestions.length}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="h-full overflow-auto">
            <CardHeader>
              <CardTitle>Programming Question</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Problem Description</h3>
                  <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-md overflow-auto">
                    {currentProgrammingQuestion.programmingQuestion.questionContent || 'Loading question...'}
                  </pre>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">
                    Difficulty: {currentProgrammingQuestion.programmingQuestion.difficulty}
                  </h4>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <CardTitle>Code Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <Editor
                height="60vh"
                defaultLanguage="cpp"
                value={programmingAnswers[currentProgrammingIndex] || ''}
                onChange={handleCodeChange}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  automaticLayout: true,
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="secondary" onClick={handlePreviousProgrammingQuestion}>
            {currentProgrammingIndex === 0 ? 'Back to MCQs' : 'Previous'}
          </Button>
          
          {currentProgrammingIndex < programmingQuestions.length - 1 ? (
            <Button onClick={handleNextProgrammingQuestion}>
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmitExam}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Exam'}
            </Button>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = regularQuestions[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto p-4">
      {alertMessage && (
        <Alert 
          variant={alertMessage.type === 'error' ? 'destructive' : 'default'} 
          className="mb-4"
        >
          <AlertDescription>{alertMessage.message}</AlertDescription>
        </Alert>
      )}

      <div className="text-right mb-4 font-bold text-red-600">
        Time Remaining: {formatTime(timeRemaining)}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Question {currentQuestionIndex + 1} of {regularQuestions.length}
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
            
            <Button 
              onClick={handleNextQuestion} 
              disabled={!selectedOption}
              className="ml-auto"
            >
              {currentQuestionIndex === regularQuestions.length - 1 && programmingQuestions.length > 0 
                ? 'Go to Programming Question' 
                : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamPagination;
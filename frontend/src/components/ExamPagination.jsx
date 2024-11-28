import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ExamPagination = ({ exam, questions, user }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [examQuestions, setExamQuestions] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(exam?.duration * 60 || 900);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [examStatus, setExamStatus] = useState('');

  const preventCopyPaste = (e) => {
    e.preventDefault();
    return false;
  };

  const preventContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  useEffect(() => {
    document.addEventListener('copy', preventCopyPaste);
    document.addEventListener('cut', preventCopyPaste);
    document.addEventListener('paste', preventCopyPaste);
    document.addEventListener('contextmenu', preventContextMenu);

    return () => {
      document.removeEventListener('copy', preventCopyPaste);
      document.removeEventListener('cut', preventCopyPaste);
      document.removeEventListener('paste', preventCopyPaste);
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);

  useEffect(() => {
    if (!questions || questions.length === 0) {
      console.error('No questions provided');
      return;
    }

    const shuffledQuestions = questions
      .sort(() => 0.5 - Math.random())
      .slice(0, exam?.no_of_questions || 10);

    setExamQuestions(shuffledQuestions);
  }, [exam, questions]);

  useEffect(() => {
    if (isSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  const autoFillUnattemptedQuestions = () => {
    const updatedAnswers = {...selectedAnswers};
    examQuestions.forEach(question => {
      if (!updatedAnswers[question.id]) {
        const options = [
          question.option1, 
          question.option2, 
          question.option3, 
          question.option4
        ].filter(opt => opt !== null && opt !== undefined);
        
        updatedAnswers[question.id] = options[Math.floor(Math.random() * options.length)];
      }
    });
    return updatedAnswers;
  };

  const handleAnswerSelect = (questionId, selectedOption) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  const handleSubmit = (isAutoSubmit = false) => {
    if (isSubmitted) return;

    if (!examQuestions.length) return;

    const finalAnswers = isAutoSubmit
      ? autoFillUnattemptedQuestions() 
      : selectedAnswers;

    const correctAnswers = examQuestions.filter(
      q => finalAnswers[q.id] === q.answer
    ).length;
    
    setScore(correctAnswers);
    setIsSubmitted(true);
    
    const percentage = (correctAnswers / examQuestions.length) * 100;
    const passingMarks = exam?.passing_marks || 50;
    const status = percentage >= passingMarks ? 'Pass' : 'Fail';
    setExamStatus(status);

    const examResult = {
      examId: exam.id,
      userId: user.id,
      totalQuestions: examQuestions.length,
      correctAnswers: correctAnswers,
      percentage: percentage,
      status: status,
      isAutoSubmitted: isAutoSubmit
    };

    saveExamResult(examResult);

  };

  const saveExamResult = (result) => {
    console.log('Exam Result:', result);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const renderQuestion = (question) => {
    if (!question) {
      return (
        <Card className="mb-4">
          <CardContent>
            <p>No question available</p>
          </CardContent>
        </Card>
      );
    }

    const options = [
      { key: 'option1', value: question.option1 },
      { key: 'option2', value: question.option2 },
      { key: 'option3', value: question.option3 },
      { key: 'option4', value: question.option4 }
    ].filter(opt => opt.value !== null && opt.value !== undefined);

    return (
      <Card 
        key={question.id} 
        className="mb-4 select-none"
        onCopy={preventCopyPaste}
        onCut={preventCopyPaste}
        onPaste={preventCopyPaste}
      >
        <CardHeader>
          <CardTitle>Question {currentPage + 1}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 user-select-none">{question.quesdesc}</p>
          {options.map((opt) => (
            <div 
              key={opt.key} 
              className={`p-2 border rounded mb-2 cursor-pointer user-select-none ${
                selectedAnswers[question.id] === opt.value 
                  ? 'bg-blue-100 border-blue-500' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => handleAnswerSelect(question.id, opt.value)}
              onCopy={preventCopyPaste}
              onCut={preventCopyPaste}
              onPaste={preventCopyPaste}
            >
              {opt.value}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  if (!examQuestions || examQuestions.length === 0) {
    return (
      <div className="text-center p-4 text-red-500">
        No questions available for this exam
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <Card className="max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle>Exam Result</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total Questions: {examQuestions.length}</p>
          <p>Correct Answers: {score}</p>
          <p>Percentage: {((score / examQuestions.length) * 100).toFixed(2)}%</p>
          <p className={`font-bold ${examStatus === 'Pass' ? 'text-green-600' : 'text-red-600'}`}>
            Result: {examStatus}
          </p>
          {examStatus === 'Fail' && (
            <p className="text-sm text-gray-600">
              Passing Marks: {exam?.passing_marks || 50}%
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div 
      className="max-w-2xl mx-auto p-4 select-none"
      onCopy={preventCopyPaste}
      onCut={preventCopyPaste}
      onPaste={preventCopyPaste}
    >
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">{exam?.exam_name || 'Exam'}</h2>
        <div className="text-red-500 font-bold text-xl">
          Time Remaining: {formatTime(timeRemaining)}
        </div>
      </div>

      {examQuestions[currentPage] && renderQuestion(examQuestions[currentPage])}

      <div className="flex justify-between mt-4">
        <Button 
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
        >
          Previous
        </Button>
        
        {currentPage === examQuestions.length - 1 ? (
          <Button onClick={() => handleSubmit(false)} variant="primary">
            Submit Exam
          </Button>
        ) : (
          <Button 
            onClick={() => setCurrentPage(prev => Math.min(examQuestions.length - 1, prev + 1))}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExamPagination;
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const AddExamModel = ({ setShowExamForm, user }) => {
  const [examData, setExamData] = useState({
    exam_name: '',
    no_of_questions: '',
    difficulty: '',
    no_of_Logical_questions: '',
    no_of_Technical_questions: '',
    no_of_Programming_mcq_questions: '',
    no_of_programming_questions: '',
    exam_start_date: '',
    exam_start_time: '',
    exam_end_date: '',
    exam_end_time: '',
    college: '',
    branch: '',
    semester: 1,
    total_marks: '',
    passing_marks:'',
    duration: '',
    created_by: user?.id || 0,
  });

  const [questionDistributionError, setQuestionDistributionError] = useState('');

  const validateQuestionDistribution = () => {
    const logical = parseInt(examData.no_of_Logical_questions) || 0;
    const technical = parseInt(examData.no_of_Technical_questions) || 0;
    const programmingMcq = parseInt(examData.no_of_Programming_mcq_questions) || 0;
    const total = parseInt(examData.no_of_questions) || 0;

    if (logical + technical + programmingMcq !== total) {
      setQuestionDistributionError('The sum of Logical, Technical, and Programming MCQ questions must equal the total number of questions');
      return false;
    }
    setQuestionDistributionError('');
    return true;
  };

  const handleExamSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateQuestionDistribution()) {
      return;
    }

    if (!examData.exam_name || !examData.no_of_questions || !examData.difficulty || 
        !examData.exam_start_date || !examData.exam_start_time || !examData.exam_end_date || 
        !examData.exam_end_time || !examData.college || !examData.branch || 
        !examData.semester || !examData.total_marks || !examData.duration) {
      alert('Please fill in all required fields');
      return;
    }

    const formattedData = {
      exam_name: examData.exam_name.trim(),
      no_of_questions: parseInt(examData.no_of_questions),
      difficulty: examData.difficulty,
      no_of_Logical_questions: parseInt(examData.no_of_Logical_questions),
      no_of_Technical_questions: parseInt(examData.no_of_Technical_questions),
      no_of_Programming_mcq_questions: parseInt(examData.no_of_Programming_mcq_questions),
      no_of_programming_questions: parseInt(examData.no_of_programming_questions),
      exam_start_date: examData.exam_start_date,
      exam_start_time: examData.exam_start_time + ':00',
      exam_end_date: examData.exam_end_date,
      exam_end_time: examData.exam_end_time + ':00',
      college: examData.college,
      branch: examData.branch,
      semester: parseInt(examData.semester),
      total_marks: parseInt(examData.total_marks),
      passing_marks: parseInt(examData.passing_marks),
      duration: parseInt(examData.duration),
      created_by: user?.id || 0,
      created_at: null,
      updated_at: null
    };

    console.log('Sending exam data:', formattedData);

    try {
      const response = await fetch('http://localhost:8081/exam', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to create exam: ${errorData}`);
      }
      
      setShowExamForm(false);
      setExamData({
        exam_name: '',
        no_of_questions: '',
        difficulty: '',
        no_of_Logical_questions: '',
        no_of_Technical_questions: '',
        no_of_Programming_mcq_questions: '',
        no_of_programming_questions: '',
        exam_start_date: '',
        exam_start_time: '',
        exam_end_date: '',
        exam_end_time: '',
        college: '',
        branch: '',
        semester: 1,
        total_marks: '',
        passing_marks:'',
        duration: '',
        created_by: user?.id || 0,
      });
    } catch (err) {
      console.error('Error creating exam:', err);
      alert('Error creating exam: ' + err.message);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Add New Exam</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleExamSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Exam Name *</label>
            <Input
              placeholder="Exam Name"
              value={examData.exam_name}
              onChange={(e) => setExamData({ ...examData, exam_name: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Difficulty Level *</label>
            <Select
              value={examData.difficulty}
              onValueChange={(value) => setExamData({ ...examData, difficulty: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EASY">Easy</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HARD">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Total Number of Questions *</label>
              <Input
                type="number"
                placeholder="Total Questions"
                value={examData.no_of_questions}
                onChange={(e) => setExamData({ ...examData, no_of_questions: e.target.value })}
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Number of Programming Questions *</label>
              <Input
                type="number"
                placeholder="Programming Questions"
                value={examData.no_of_programming_questions}
                onChange={(e) => setExamData({ ...examData, no_of_programming_questions: e.target.value })}
                required
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Logical Questions *</label>
              <Input
                type="number"
                placeholder="Logical Questions"
                value={examData.no_of_Logical_questions}
                onChange={(e) => {
                  setExamData({ ...examData, no_of_Logical_questions: e.target.value });
                  setQuestionDistributionError('');
                }}
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Technical Questions *</label>
              <Input
                type="number"
                placeholder="Technical Questions"
                value={examData.no_of_Technical_questions}
                onChange={(e) => {
                  setExamData({ ...examData, no_of_Technical_questions: e.target.value });
                  setQuestionDistributionError('');
                }}
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Programming MCQ *</label>
              <Input
                type="number"
                placeholder="Programming MCQ"
                value={examData.no_of_Programming_mcq_questions}
                onChange={(e) => {
                  setExamData({ ...examData, no_of_Programming_mcq_questions: e.target.value });
                  setQuestionDistributionError('');
                }}
                required
                min="0"
              />
            </div>
          </div>

          {questionDistributionError && (
            <div className="text-red-500 text-sm">{questionDistributionError}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Start Date *</label>
              <Input
                type="date"
                value={examData.exam_start_date}
                onChange={(e) => setExamData({ ...examData, exam_start_date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Start Time *</label>
              <Input
                type="time"
                value={examData.exam_start_time}
                onChange={(e) => setExamData({ ...examData, exam_start_time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">End Date *</label>
              <Input
                type="date"
                value={examData.exam_end_date}
                onChange={(e) => setExamData({ ...examData, exam_end_date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">End Time *</label>
              <Input
                type="time"
                value={examData.exam_end_time}
                onChange={(e) => setExamData({ ...examData, exam_end_time: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">College *</label>
            <Select
              value={examData.college}
              onValueChange={(value) => setExamData({ ...examData, college: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select College" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ganpat University">Ganpat University</SelectItem>
                <SelectItem value="Nirma University">Nirma University</SelectItem>
                <SelectItem value="Sankalchand University">Sankalchand University</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm mb-1">Branch *</label>
            <Select
              value={examData.branch}
              onValueChange={(value) => setExamData({ ...examData, branch: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Computer Engineering">Computer Engineering</SelectItem>
                <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm mb-1">Semester *</label>
            <Select
              value={examData.semester}
              onValueChange={(value) => setExamData({ ...examData, semester: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Semester 1</SelectItem>
                <SelectItem value="2">Semester 2</SelectItem>
                <SelectItem value="3">Semester 3</SelectItem>
                <SelectItem value="4">Semester 4</SelectItem>
                <SelectItem value="5">Semester 5</SelectItem>
                <SelectItem value="6">Semester 6</SelectItem>
                <SelectItem value="7">Semester 7</SelectItem>
                <SelectItem value="8">Semester 8</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm mb-1">Total Marks *</label>
            <Input
              type="number"
              placeholder="Total Marks"
              value={examData.total_marks}
              onChange={(e) => setExamData({ ...examData, total_marks: e.target.value })}
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Passing Marks *</label>
            <Input
              type="number"
              placeholder="Passing Marks"
              value={examData.passing_marks}
              onChange={(e) => setExamData({ ...examData, passing_marks: e.target.value })}
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Duration (in minutes) *</label>
            <Input
              type="number"
              placeholder="Duration (in minutes)"
              value={examData.duration}
              onChange={(e) => setExamData({ ...examData, duration: e.target.value })}
              required
              min="1"
            />
          </div>

          <Button type="submit" className="w-full">Create Exam</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddExamModel;
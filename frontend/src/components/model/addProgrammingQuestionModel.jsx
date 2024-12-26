import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';

const AddProgrammingQuestionModel = ({ setShowQuestionForm, user }) => {
  const [questionData, setQuestionData] = useState({
    questionContent: '',
    solution1: '',
    solution2: '',
    solution3: '',
    solution4: '',
    difficulty: 'Easy'
  });

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    
    const now = new Date().toISOString();
    const formData = {
      ...questionData,
      createdAt: now,
      updatedAt: now,
      createdBy: user.id
    };

    try {
      const response = await fetch('http://localhost:8081/programming-question', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Failed to create programming question');
      
      setShowQuestionForm(false);
      setQuestionData({
        questionContent: '',
        solution1: '',
        solution2: '',
        solution3: '',
        solution4: '',
        difficulty: 'Easy'
      });
    } catch (err) {
      console.error('Error creating programming question:', err);
    }
  };

  const placeholderContent = `Problem Description:
Given an array of integers nums and an integer target...

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]`;

  const placeholderSolution = `// Solution approach explanation

function solve(Parameters) {
    // Solution implementation
}`;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Add New Programming Question</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleQuestionSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Question Content</label>
            <Textarea
              placeholder={placeholderContent}
              value={questionData.questionContent}
              onChange={(e) => setQuestionData({ ...questionData, questionContent: e.target.value })}
              className="h-64 font-mono"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Solution 1 (Required)</label>
            <Textarea
              placeholder={placeholderSolution}
              value={questionData.solution1}
              onChange={(e) => setQuestionData({ ...questionData, solution1: e.target.value })}
              className="h-48 font-mono"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Solution 2 (Optional)</label>
            <Textarea
              placeholder={placeholderSolution}
              value={questionData.solution2}
              onChange={(e) => setQuestionData({ ...questionData, solution2: e.target.value })}
              className="h-48 font-mono"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Solution 3 (Optional)</label>
            <Textarea
              placeholder={placeholderSolution}
              value={questionData.solution3}
              onChange={(e) => setQuestionData({ ...questionData, solution3: e.target.value })}
              className="h-48 font-mono"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Solution 4 (Optional)</label>
            <Textarea
              placeholder={placeholderSolution}
              value={questionData.solution4}
              onChange={(e) => setQuestionData({ ...questionData, solution4: e.target.value })}
              className="h-48 font-mono"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Difficulty</label>
            <Select
              value={questionData.difficulty}
              onValueChange={(value) => setQuestionData({ ...questionData, difficulty: value })}
            >
              <SelectTrigger className="w-full">
                <span>{questionData.difficulty}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setShowQuestionForm(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Question</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddProgrammingQuestionModel;
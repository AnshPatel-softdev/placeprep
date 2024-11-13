import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';

const AddQuestionModel = ({setShowQuestionForm,user}) => {
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


      return(
        <>
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
        </>
      )

}

  export default AddQuestionModel;
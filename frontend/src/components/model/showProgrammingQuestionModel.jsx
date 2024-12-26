import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Code2, Save } from 'lucide-react';

const ShowProgrammingQuestionModel = ({user}) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [deleteQuestion, setDeleteQuestion] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSolutionDialog, setShowSolutionDialog] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [currentSolutionNumber, setCurrentSolutionNumber] = useState(null);

  const [filters, setFilters] = useState({
    id: '',
    difficulty: 'ALL'
  });

  const [editFormData, setEditFormData] = useState({
    id:'',
    questionContent: '',
    solution1: '',
    solution2: '',
    solution3: '',
    solution4: '',
    difficulty: ''
  });

  const difficulties = ['Easy', 'Medium', 'Hard'];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8081/programming-question', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setQuestions(data);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const filteredQuestions = questions.filter(question => {
    return (
      (filters.id === '' || question.id.toString().includes(filters.id)) &&
      (filters.difficulty === 'ALL' || question.difficulty === filters.difficulty)
    );
  });

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:8081/programming-question/${editFormData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      setShowEditDialog(false);
      fetchQuestions();
    } catch (err) {
      console.error('Error updating question:', err);
      setError('Failed to update question. Please try again.');
    }
  };

  const handleDelete = async (questionId) => {
    try {
      const response = await fetch(`http://localhost:8081/programming-question/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      setShowDeleteDialog(false);
      setDeleteQuestion(null);
      setQuestions(questions.filter(q => q.id !== questionId));
    } catch (err) {
      console.error('Error deleting question:', err);
      setError('Failed to delete question. Please try again.');
    }
  };

  const handleViewSolution = (question, solutionNumber) => {
    setSelectedSolution(question[`solution${solutionNumber}`]);
    setCurrentSolutionNumber(solutionNumber);
    setShowSolutionDialog(true);
  };

  const handleEdit = (question) => {
    setEditFormData({
      id: question.id,
      questionContent: question.questionContent,
      solution1: question.solution1 || '',
      solution2: question.solution2 || '',
      solution3: question.solution3 || '',
      solution4: question.solution4 || '',
      difficulty: question.difficulty
    });
    setShowEditDialog(true);
  };

  const handleViewDetails = (question) => {
    setSelectedQuestion(question);
    setShowDetailsDialog(true);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return '';
    }
  };

  if (loading) return <div className="p-4">Loading questions...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Programming Questions Bank</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Input 
          placeholder="Question ID" 
          value={filters.id}
          onChange={(e) => handleFilterChange('id', e.target.value)}
        />
        <Select 
          value={filters.difficulty}
          onValueChange={(value) => handleFilterChange('difficulty', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Difficulties</SelectItem>
            {difficulties.map((difficulty) => (
              <SelectItem key={difficulty} value={difficulty}>
                {difficulty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question Content</TableHead>
              <TableHead className="text-center">Difficulty</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.length === 0 ? (
              <TableRow>
                <TableCell colSpan="3" className="text-center text-gray-500">
                  No questions found.
                </TableCell>
              </TableRow>
            ) : (
              filteredQuestions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="font-medium max-w-md truncate">
                    {question.questionContent.split('\n')[0]}
                  </TableCell>
                  <TableCell className={`text-center ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </TableCell>
                  <TableCell className="text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 mr-2"
                            onClick={() => handleViewDetails(question)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View details</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 mr-2"
                            onClick={() => handleEdit(question)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit question</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            onClick={() => {
                              setDeleteQuestion(question);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete question</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Question Details</DialogTitle>
          </DialogHeader>
          {selectedQuestion && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Question Description:</h3>
                <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
                  {selectedQuestion.questionContent}
                </pre>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Solutions:</h3>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((num) => {
                    const solution = selectedQuestion[`solution${num}`];
                    if (!solution) return null;
                    return (
                      <Button
                        key={num}
                        variant="outline"
                        onClick={() => handleViewSolution(selectedQuestion, num)}
                        className="flex items-center gap-2"
                      >
                        <Code2 className="h-4 w-4" />
                        Solution {num}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Programming Question</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="questionContent">Question Content</Label>
              <Textarea
                id="questionContent"
                name="questionContent"
                value={editFormData.questionContent}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  questionContent: e.target.value
                })}
                className="min-h-[200px] font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={editFormData.difficulty}
                onValueChange={(value) => setEditFormData({
                  ...editFormData,
                  difficulty: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Solutions:</h3>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <Button
                    key={num}
                    variant="outline"
                    onClick={() => handleViewSolution(editFormData, num)}
                    className="flex items-center gap-2"
                  >
                    <Code2 className="h-4 w-4" />
                    Solution {num}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSolutionDialog} onOpenChange={setShowSolutionDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
            <DialogTitle>Solution {currentSolutionNumber}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
            {showEditDialog ? (
                <div className="space-y-2">
                <Label>Edit Solution {currentSolutionNumber}</Label>
                <Textarea
                    value={editFormData[`solution${currentSolutionNumber}`] || ''}
                    onChange={(e) => setEditFormData(prev => ({
                    ...prev,
                    [`solution${currentSolutionNumber}`]: e.target.value
                    }))}
                    className="min-h-[400px] font-mono"
                />
                </div>
            ) : (
                <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
                {selectedSolution || ''}
                </pre>
            )}
            </div>
            <DialogFooter>
            <Button variant="outline" onClick={() => setShowSolutionDialog(false)}>
                Close
            </Button>
            {showEditDialog && (
                <Button onClick={() => setShowSolutionDialog(false)}>
                Save Solution
                </Button>
            )}
            </DialogFooter>
        </DialogContent>
        </Dialog>
        
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">
              Delete Programming Question
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Are you sure you want to delete this question? <br/>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="bg-gray-100 px-6 py-4">
            <div className="flex items-center justify-between w-full">
              <Button
                onClick={() => setShowDeleteDialog(false)}
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleDelete(deleteQuestion?.id)}
              >
                Delete
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShowProgrammingQuestionModel;
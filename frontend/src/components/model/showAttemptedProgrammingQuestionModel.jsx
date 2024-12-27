import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Code2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const ShowAttemptedProgrammingQuestions = ({ user }) => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showSolutionDialog, setShowSolutionDialog] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [currentSolutionNumber, setCurrentSolutionNumber] = useState(null);

  const [filters, setFilters] = useState({
    examName: '',
    username: ''
  });

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8081/attempted_programming_question', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setAttempts(data);
    } catch (err) {
      console.error('Error fetching attempts:', err);
      setError('Failed to load attempted questions. Please try again later.');
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

  const filteredAttempts = attempts.filter(attempt => {
    return (
      (filters.examName === '' || attempt.exam.exam_name.toLowerCase().includes(filters.examName.toLowerCase())) &&
      (filters.username === '' || attempt.user.username.toLowerCase().includes(filters.username.toLowerCase()))
    );
  });

  const handleViewSolution = (attempt, solutionNumber) => {
    setSelectedSolution(attempt.programmingQuestion[`solution${solutionNumber}`]);
    setCurrentSolutionNumber(solutionNumber);
    setShowSolutionDialog(true);
  };

  const handleViewDetails = (attempt) => {
    setSelectedAttempt(attempt);
    setShowDetailsDialog(true);
  };

  if (loading) return <div className="p-4">Loading attempts...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Attempted Programming Questions</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Input 
          placeholder="Filter by Exam Name" 
          value={filters.examName}
          onChange={(e) => handleFilterChange('examName', e.target.value)}
        />
        <Input 
          placeholder="Filter by Username" 
          value={filters.username}
          onChange={(e) => handleFilterChange('username', e.target.value)}
        />
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Exam Name</TableHead>
                <TableHead>Question</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttempts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="4" className="text-center text-gray-500">
                    No attempts found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAttempts.map((attempt) => (
                  <TableRow key={attempt.id}>
                    <TableCell>{attempt.user.username}</TableCell>
                    <TableCell>{attempt.exam.exam_name}</TableCell>
                    <TableCell className="max-w-md truncate">
                      {attempt.programmingQuestion.questionContent.split('\n')[0]}
                    </TableCell>
                    <TableCell className="text-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleViewDetails(attempt)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Attempt Details</DialogTitle>
          </DialogHeader>
          {selectedAttempt && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Student Details:</h4>
                  <p>Name: {selectedAttempt.user.firstname} {selectedAttempt.user.lastname}</p>
                  <p>Username: {selectedAttempt.user.username}</p>
                  <p>College: {selectedAttempt.user.college}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Exam Details:</h4>
                  <p>Exam Name: {selectedAttempt.exam.exam_name}</p>
                  <p>Date: {new Date(selectedAttempt.createdAt).toLocaleDateString()}</p>
                  <p>Time: {new Date(selectedAttempt.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold">Question:</h4>
                <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
                  {selectedAttempt.programmingQuestion.questionContent}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold">Student's Answer:</h4>
                <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
                  {selectedAttempt.answer}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold">Available Solutions:</h4>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4].map((num) => {
                    const solution = selectedAttempt.programmingQuestion[`solution${num}`];
                    if (!solution) return null;
                    return (
                      <Button
                        key={num}
                        variant="outline"
                        onClick={() => handleViewSolution(selectedAttempt.programmingQuestion, num)}
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

      <Dialog open={showSolutionDialog} onOpenChange={setShowSolutionDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Solution {currentSolutionNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md font-mono">
              {selectedSolution || ''}
            </pre>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSolutionDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShowAttemptedProgrammingQuestions;
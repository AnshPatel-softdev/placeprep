import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Trash2, Plus, Loader2, AlertCircle, Eye, Code } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ExamManagement = ({user}) => {
  const [exams, setExams] = useState([]);
  const [mcqQuestions, setMcqQuestions] = useState([]);
  const [programmingQuestions, setProgrammingQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteQuestion, setDeleteQuestion] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddQuestionDialog, setShowAddQuestionDialog] = useState(false);  
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [viewQuestionDetails, setViewQuestionDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("mcq");
  const [allProgrammingQuestions, setAllProgrammingQuestions] = useState([]);
  const [selectedProgrammingQuestions, setSelectedProgrammingQuestions] = useState([]);
  const [showAddProgrammingDialog, setShowAddProgrammingDialog] = useState(false);

  const [filters, setFilters] = useState({
    id: '',
    type: 'ALL',
    difficulty: 'ALL',
    source: 'EXAM'
  });

  const types = ['Technical', 'Logical','Programming'];
  const difficulty = ['Easy', 'Medium', 'Hard'];

  const fetchExams = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8081/exam', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      setExams(response.data);
      setIsLoading(false);
    } catch (error) {
      setError('Failed to fetch exams. Please try again later.');
      setIsLoading(false);
    }
  };

  const fetchAllQuestions = async () => {
    try {
      const [mcqResponse, programmingResponse] = await Promise.all([
        axios.get('http://localhost:8081/question', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        }),
        axios.get('http://localhost:8081/programming-question', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        })
      ]);
      
      setAllQuestions(mcqResponse.data);
      setAllProgrammingQuestions(programmingResponse.data);

    } catch (error) {
      setError('Failed to fetch available questions.');
    }
  };
  console.log(allProgrammingQuestions)
  const fetchExamQuestions = async (examId) => {
    setIsLoading(true);
    setError(null);
    try {
      const mcqResponse = await axios.get(`http://localhost:8081/exam/${examId}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const mcqData = mcqResponse.data.map(item => item.question);
      setMcqQuestions(mcqData);

      const programmingResponse = await axios.get(`http://localhost:8081/exam/programming/${parseInt(examId)}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      setProgrammingQuestions(programmingResponse.data);
      setIsLoading(false);
    } catch (error) {
      setError('Failed to fetch exam questions. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filterName, value, source = filters.source) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value,
      source: source
    }));
  };

  const filteredExamQuestions = mcqQuestions.filter(question => {
    return (
      (filters.source !== 'EXAM' || filters.id === '' || 
        question.id.toString().includes(filters.id)) &&
      (filters.source !== 'EXAM' || filters.type === 'ALL' || 
        question.type?.toLowerCase() === filters.type.toLowerCase()) &&
      (filters.source !== 'EXAM' || filters.difficulty === 'ALL' || 
        question.difficulty?.toLowerCase() === filters.difficulty.toLowerCase())
    );
  });

  const filteredAvailableQuestions = allQuestions
    .filter(q => !mcqQuestions.some(eq => eq.id === q.id))
    .filter(question => {
      return (
        (filters.source !== 'ADD' || filters.id === '' || 
          question.id.toString().includes(filters.id)) &&
        (filters.source !== 'ADD' || filters.type === 'ALL' || 
          question.type?.toLowerCase() === filters.type.toLowerCase()) &&
        (filters.source !== 'ADD' || filters.difficulty === 'ALL' || 
          question.difficulty?.toLowerCase() === filters.difficulty.toLowerCase())
      );
    });

  const handleExamSelect = (exam) => {
    setSelectedExam(exam);
    fetchExamQuestions(exam.id);
  };

  const handleDeleteQuestion = async () => {
    if (deleteQuestion && selectedExam) {
      try {
        await axios.delete(`http://localhost:8081/exam/${selectedExam.id}/${deleteQuestion.id}`,{
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          });
        setMcqQuestions(mcqQuestions.filter(q => q.id !== deleteQuestion.id));
        setShowDeleteDialog(false);
        setDeleteQuestion(null);
      } catch (error) {
        setError('Failed to delete question. Please try again later.');
        setShowDeleteDialog(false);
      }
    }
  };

  const handleDeleteProgrammingQuestion = async () => {
    if (deleteQuestion && selectedExam) {
      try {
        await axios.delete(`http://localhost:8081/exam/programming/${selectedExam.id}/${deleteQuestion.id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        setProgrammingQuestions(programmingQuestions.filter(q => q.id !== deleteQuestion.id));
        setShowDeleteDialog(false);
        setDeleteQuestion(null);
      } catch (error) {
        setError('Failed to delete programming question. Please try again later.');
        setShowDeleteDialog(false);
      }
    }
  };

  const openDeleteDialog = (question) => {
    setDeleteQuestion(question);
    setShowDeleteDialog(true);
  };

  const openQuestionDetails = (question) => {
    setViewQuestionDetails(question);
  };

  const handleAddSelectedQuestions = async () => {
    if (selectedExam && selectedQuestions.length > 0) {
      try {
        for (const questionId of selectedQuestions) {
            const selectedQuestion = allQuestions.find((item) => item.id === questionId);
            
            await axios.post(`http://localhost:8081/exam/${selectedExam.id}`, 
              selectedQuestion,
              {
                headers: {
                  'Authorization': `Bearer ${user.token}`,
                  'Content-Type': 'application/json'
                }
              }
            );
        }
       
        fetchExamQuestions(selectedExam.id);
       
        setSelectedQuestions([]);
        setShowAddQuestionDialog(false);
      } catch (error) {
        console.error(error);
        setError('Failed to add questions to exam. Please try again later.');
      }
    }
  };

  const handleAddSelectedProgrammingQuestions = async () => {
    if (selectedExam && selectedProgrammingQuestions.length > 0) {
      try {
        for (const questionId of selectedProgrammingQuestions) {
          const selectedQuestion = allProgrammingQuestions.find((item) => item.id === questionId);
          
          await axios.post(`http://localhost:8081/exam/programming/${selectedExam.id}`, 
            selectedQuestion,
            {
              headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
              }
            }
          );
        }
        
        fetchExamQuestions(selectedExam.id);
        setSelectedProgrammingQuestions([]);
        setShowAddProgrammingDialog(false);
      } catch (error) {
        console.error(error);
        setError('Failed to add programming questions to exam. Please try again later.');
      }
    }
  };

  const toggleQuestionSelection = (questionId) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const toggleProgrammingQuestionSelection = (questionId) => {
    setSelectedProgrammingQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const filteredAvailableProgrammingQuestions = allProgrammingQuestions
    .filter(q => !programmingQuestions.some(eq => eq.id === q.id))
    .filter(question => {
      return (
        (filters.source !== 'ADD' || filters.id === '' || 
          question.id.toString().includes(filters.id)) &&
        (filters.source !== 'ADD' || filters.difficulty === 'ALL' || 
          question.difficulty?.toLowerCase() === filters.difficulty.toLowerCase())
      );
    });

  const getDifficultyColor = (difficulty) => {
    if (!difficulty) return '';
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'hard':
        return 'text-red-600';
      default:
        return '';
    }
  };

  useEffect(() => {
    fetchExams();
    fetchAllQuestions();
  }, []);
  const renderQuestionDetails = (question) => {
    if (activeTab === "mcq") {
      return (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Question Description:</h3>
            <p>{question.quesdesc}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Option 1:</h3>
              <p>{question.option1}</p>
            </div>
            <div>
              <h3 className="font-semibold">Option 2:</h3>
              <p>{question.option2}</p>
            </div>
            <div>
              <h3 className="font-semibold">Option 3:</h3>
              <p>{question.option3}</p>
            </div>
            <div>
              <h3 className="font-semibold">Option 4:</h3>
              <p>{question.option4}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Correct Answer:</h3>
            <p>{question.answer}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Type:</h3>
              <p>{question.type}</p>
            </div>
            <div>
              <h3 className="font-semibold">Difficulty:</h3>
              <p>{question.difficulty}</p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Problem Statement:</h3>
            <p>{question.questionContent}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Difficulty:</h3>
              <p>{question.difficulty}</p>
            </div>
          </div>
        </div>
      );
    }
  };
  return (
    <div className="flex flex-col">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex">
        <Card className="w-1/3 mr-4">
          <CardHeader>
            <CardTitle>Scheduled Exams</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              exams.map(exam => (
                <Button 
                  key={exam.id} 
                  variant="outline" 
                  className="w-full mb-2"
                  onClick={() => handleExamSelect(exam)}
                >
                  {exam.exam_name} - {exam.college}
                </Button>
              ))
            )}
          </CardContent>
        </Card>

        {selectedExam && (
        <Card className="w-2/3">
          <CardHeader>
            <CardTitle>{selectedExam.exam_name} Questions</CardTitle>
          </CardHeader>
          <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="mcq">MCQ Questions</TabsTrigger>
              <TabsTrigger value="programming">Programming Questions</TabsTrigger>
            </TabsList>
            <TabsContent value="mcq">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Input 
                placeholder="Question ID" 
                value={filters.id}
                onChange={(e) => handleFilterChange('id', e.target.value, 'EXAM')}
              />
              <Select 
                value={filters.type}
                onValueChange={(value) => handleFilterChange('type', value, 'EXAM')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Question Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select 
                value={filters.difficulty}
                onValueChange={(value) => handleFilterChange('difficulty', value, 'EXAM')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Difficulties</SelectItem>
                  {difficulty.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExamQuestions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="4" className="text-center text-gray-500">
                      No questions match the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExamQuestions.map(question => (
                      <TableRow key={question.id}>
                        <TableCell>{question.quesdesc}</TableCell>
                        <TableCell>{question.type}</TableCell>
                        <TableCell className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost"
                            size="icon"
                            className="mr-2"
                            onClick={() => openQuestionDetails(question)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => openDeleteDialog(question)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <div className="flex space-x-4 mt-4">
                <Button onClick={() => setShowAddQuestionDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Existing Questions
                </Button>
              </div>
              </TabsContent>
              <TabsContent value="programming">
                <div className="flex justify-between mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      placeholder="Question ID" 
                      value={filters.id}
                      onChange={(e) => handleFilterChange('id', e.target.value, 'EXAM')}
                    />
                    <Select 
                      value={filters.difficulty}
                      onValueChange={(value) => handleFilterChange('difficulty', value, 'EXAM')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Difficulties</SelectItem>
                        {difficulty.map((difficulty) => (
                          <SelectItem key={difficulty} value={difficulty}>
                            {difficulty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => setShowAddProgrammingDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Programming Questions
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Problem Statement</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programmingQuestions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan="4" className="text-center text-gray-500">
                          No programming questions added yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      programmingQuestions.map(question => (
                        <TableRow key={question.id}>
                          <TableCell>{question.programmingQuestion.questionContent}</TableCell>
                          <TableCell className={getDifficultyColor(question.programmingQuestion.difficulty)}>
                            {question.programmingQuestion.difficulty}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost"
                              size="icon"
                              className="mr-2"
                              onClick={() => openQuestionDetails(question)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="icon"
                              onClick={() => openDeleteDialog(question)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent
          className="bg-white text-black p-6 rounded-md shadow-lg"
          style={{ maxWidth: "600px", width: "90%" }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">
              Delete Question
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-600 mt-4 text-center">
              Are you sure you want to delete this question? <br />
              <span
                className="block mt-4 text-indigo-500 font-medium"
                style={{ wordWrap: "break-word" }} 
              >
                {deleteQuestion?.quesdesc}
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex justify-end gap-4">
            <Button
              onClick={() => setShowDeleteDialog(false)}
              variant="ghost"
              className="px-5 py-2"
            >
              Cancel
            </Button>
            <Button
                variant="destructive"
                onClick={activeTab === "mcq" ? handleDeleteQuestion : handleDeleteProgrammingQuestion}
                className="px-5 py-2"
            >
                Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddProgrammingDialog} onOpenChange={setShowAddProgrammingDialog}>
        <DialogContent className="max-w-4xl h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Programming Questions to Exam</DialogTitle>
            <DialogDescription>
              Select programming questions to add to {selectedExam?.exam_name}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input 
              placeholder="Question ID" 
              value={filters.id}
              onChange={(e) => handleFilterChange('id', e.target.value, 'ADD')}
            />
            <Select 
              value={filters.difficulty}
              onValueChange={(value) => handleFilterChange('difficulty', value, 'ADD')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Difficulties</SelectItem>
                {difficulty.map((difficulties) => (
                  <SelectItem key={difficulties} value={difficulties}>
                    {difficulties}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-grow overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Select</TableHead>
                  <TableHead>Problem Statement</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAvailableProgrammingQuestions.map(question => (
                  <TableRow key={question.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedProgrammingQuestions.includes(question.id)}
                        onCheckedChange={() => toggleProgrammingQuestionSelection(question.id)}
                      />
                    </TableCell>
                    <TableCell>{question.questionContent}</TableCell>
                    <TableCell>{question.difficulty}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost"
                        size="icon"
                        onClick={() => openQuestionDetails(question)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setShowAddProgrammingDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddSelectedProgrammingQuestions}
              disabled={selectedProgrammingQuestions.length === 0}
            >
              Add {selectedProgrammingQuestions.length} Question{selectedProgrammingQuestions.length !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddQuestionDialog} onOpenChange={setShowAddQuestionDialog}>
        <DialogContent className="max-w-4xl h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Questions to Exam</DialogTitle>
            <DialogDescription>
              Select questions to add to {selectedExam?.exam_name}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <Input 
              placeholder="Question ID" 
              value={filters.id}
              onChange={(e) => handleFilterChange('id', e.target.value, 'ADD')}
            />
            <Select 
              value={filters.type}
              onValueChange={(value) => handleFilterChange('type', value, 'ADD')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Question Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={filters.difficulty}
              onValueChange={(value) => handleFilterChange('difficulty', value, 'ADD')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Difficulties</SelectItem>
                {difficulty.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-grow overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Select</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAvailableQuestions.map(question => (
                  <TableRow key={question.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedQuestions.includes(question.id)}
                        onCheckedChange={() => toggleQuestionSelection(question.id)}
                      />
                    </TableCell>
                    <TableCell>{question.quesdesc}</TableCell>
                    <TableCell>{question.type}</TableCell>
                    <TableCell>{question.difficulty}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost"
                        size="icon"
                        onClick={() => openQuestionDetails(question)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setShowAddQuestionDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddSelectedQuestions}
              disabled={selectedQuestions.length === 0}
            >
              Add {selectedQuestions.length} Question{selectedQuestions.length !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog 
        open={!!viewQuestionDetails} 
        onOpenChange={() => setViewQuestionDetails(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Question Details</DialogTitle>
          </DialogHeader>
          {viewQuestionDetails && renderQuestionDetails(viewQuestionDetails)}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExamManagement;
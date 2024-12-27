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
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ShowExamModel = ({ user }) => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [deleteExam, setDeleteExam] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    examName: '',
    college: '',
    branch: '',
    semester: 'ALL',
    startDate: ''
  });

  const [editFormData, setEditFormData] = useState({
    exam_name: '',
    no_of_questions: '',
    no_of_programming_questions: '',
    exam_start_date: '',
    exam_start_time: '',
    exam_end_date: '',
    exam_end_time: '',
    college: '',
    total_marks: '',
    passing_marks: '',
    duration: '',
    created_by: user.id ? user.id : 0,
    branch: '', 
    semester: 1
  });

  const branches = [
    'Computer Engineering', 
    'Electrical Engineering', 
    'Mechanical Engineering', 
    'Civil Engineering', 
    'Information Technology'
  ];

  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8081/exam', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExams(data);
    } catch (err) {
      console.error('Error fetching exams:', err);
      setError('Failed to load exams. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }));
  };

  const filteredExams = exams.filter(exam => {
    return (
      (filters.examName === '' || 
        exam.exam_name?.toLowerCase().includes(filters.examName.toLowerCase())) &&
      (filters.college === '' || 
        exam.college?.toLowerCase().includes(filters.college.toLowerCase())) &&
      (filters.branch === '' || 
        exam.branch?.toLowerCase().includes(filters.branch.toLowerCase())) &&
      (filters.semester === 'ALL' || 
        exam.semester?.toString() === filters.semester) &&
      (filters.startDate === '' || 
        exam.exam_start_date?.includes(filters.startDate))
    );
  });

  const handleUpdate = async () => {
    editFormData.semester = parseInt(editFormData.semester)
    editFormData.passing_marks = parseInt(editFormData.passing_marks)
    editFormData.total_marks = parseInt(editFormData.total_marks)
    editFormData.duration = parseInt(editFormData.duration)
    editFormData.no_of_questions = parseInt(editFormData.no_of_questions)
    editFormData.no_of_programming_questions = parseInt(editFormData.no_of_programming_questions);
    try {
      const response = await fetch(`http://localhost:8081/exam/${editFormData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setShowEditDialog(false);
      fetchExams();
    } catch (err) {
      console.error('Error updating exam:', err);
      setError('Failed to update exam. Please try again.');
    }
  };

  const handleDelete = async (examId) => {
    try {
      const response = await fetch(`http://localhost:8081/exam/${examId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setDeleteExam(null);
      setShowDeleteDialog(false);
      setExams(exams.filter(exam => exam.id !== examId));
    } catch (err) {
      console.error('Error deleting exam:', err);
      setError('Failed to delete exam. Please try again.');
    }
  };

  const handleEdit = (exam) => {
    setEditFormData(exam);
    setShowEditDialog(true);
  };

  const handleViewDetails = (exam) => {
    setSelectedExam(exam);
    setShowDetailsDialog(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteDialog = (exam) => {
    setDeleteExam(exam);
    setShowDeleteDialog(true);
  };

  const formatDateTime = (date, time) => {
    return `${new Date(date).toLocaleDateString()} ${time}`;
  };

  if (loading) {
    return <div className="p-4">Loading exams...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Exam Management</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-5 gap-4 mb-4">
        <Input 
          placeholder="Exam Name" 
          value={filters.examName}
          onChange={(e) => handleFilterChange('examName', e.target.value)}
        />
        <Input 
          placeholder="College" 
          value={filters.college}
          onChange={(e) => handleFilterChange('college', e.target.value)}
        />
        <Input 
          placeholder="Branch" 
          value={filters.branch}
          onChange={(e) => handleFilterChange('branch', e.target.value)}
        />
        <Select 
          value={filters.semester}
          onValueChange={(value) => handleFilterChange('semester', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Semesters</SelectItem>
            {semesters.map((semester) => (
              <SelectItem key={semester} value={semester}>
                {semester}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input 
          type="date"
          placeholder="Start Date" 
          value={filters.startDate}
          onChange={(e) => handleFilterChange('startDate', e.target.value)}
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exam Name</TableHead>
              <TableHead className="text-center">College</TableHead>
              <TableHead className="text-center">Branch</TableHead>
              <TableHead className="text-center">Semester</TableHead>
              <TableHead className="text-center">Start Date</TableHead>
              <TableHead className="text-center">Duration</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExams.length === 0 ? (
              <TableRow>
                <TableCell colSpan="7" className="text-center text-gray-500">
                  No exams match the current filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredExams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.exam_name}</TableCell>
                  <TableCell className="text-center">{exam.college}</TableCell>
                  <TableCell className="text-center">{exam.branch ? exam.branch : 'N/A'}</TableCell>
                  <TableCell className="text-center">{exam.semester ? exam.semester : 'N/A'}</TableCell>
                  <TableCell className="text-center">
                    {formatDateTime(exam.exam_start_date, exam.exam_start_time)}
                  </TableCell>
                  <TableCell className="text-center">{exam.duration} mins</TableCell>
                  <TableCell className="text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 mr-2"
                            onClick={() => handleViewDetails(exam)}
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
                            onClick={() => handleEdit(exam)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit exam</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteDialog(exam)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete exam</p>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Exam Details</DialogTitle>
          </DialogHeader>
          {selectedExam && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Basic Information</h3>
                  <p><span className="font-medium">Exam Name:</span> {selectedExam.exam_name}</p>
                  <p><span className="font-medium">College:</span> {selectedExam.college}</p>
                  <p><span className="font-medium">Branch:</span> {selectedExam.branch}</p>
                  <p><span className="font-medium">Semester:</span> {selectedExam.semester}</p>
                  <p><span className="font-medium">MCQ Questions:</span> {selectedExam.no_of_questions}</p>
                  <p><span className="font-medium">Programming Questions:</span> {selectedExam.no_of_programming_questions}</p>
                  <p><span className="font-medium">Total Marks:</span> {selectedExam.total_marks}</p>
                  <p><span className="font-medium">Passing Marks:</span> {selectedExam.passing_marks}</p>
                  <p><span className="font-medium">Duration:</span> {selectedExam.duration} mins</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Schedule</h3>
                  <p><span className="font-medium">Start:</span> {formatDateTime(selectedExam.exam_start_date, selectedExam.exam_start_time)}</p>
                  <p><span className="font-medium">End:</span> {formatDateTime(selectedExam.exam_end_date, selectedExam.exam_end_time)}</p>
                  <p><span className="font-medium">Created By:</span> {selectedExam.created_by}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b">
          <DialogTitle className="text-2xl font-semibold">Edit Exam</DialogTitle>
        </DialogHeader>
        
        <div className="py-6 space-y-8">
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="exam_name" className="text-sm font-medium">Exam Name</Label>
                <Input
                  id="exam_name"
                  name="exam_name"
                  value={editFormData.exam_name}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="college" className="text-sm font-medium">College</Label>
                <Input
                  id="college"
                  name="college"
                  value={editFormData.college}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium">Exam Structure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="no_of_questions" className="text-sm font-medium">Number of Questions</Label>
                <Input
                  id="no_of_questions"
                  name="no_of_questions"
                  type="number"
                  value={editFormData.no_of_questions}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="no_of_programming_questions" className="text-sm font-medium">Programming Questions</Label>
                <Input
                  id="no_of_programming_questions"
                  name="no_of_programming_questions"
                  type="number"
                  value={editFormData.no_of_programming_questions}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_marks" className="text-sm font-medium">Total Marks</Label>
                <Input
                  id="total_marks"
                  name="total_marks"
                  type="number"
                  value={editFormData.total_marks}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passing_marks" className="text-sm font-medium">Passing Marks</Label>
                <Input
                  id="passing_marks"
                  name="passing_marks"
                  type="number"
                  value={editFormData.passing_marks}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium">Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="exam_start_date" className="text-sm font-medium">Start Date</Label>
                <Input
                  id="exam_start_date"
                  name="exam_start_date"
                  type="date"
                  value={editFormData.exam_start_date}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exam_start_time" className="text-sm font-medium">Start Time</Label>
                <Input
                  id="exam_start_time"
                  name="exam_start_time"
                  type="time"
                  value={editFormData.exam_start_time}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exam_end_date" className="text-sm font-medium">End Date</Label>
                <Input
                  id="exam_end_date"
                  name="exam_end_date"
                  type="date"
                  value={editFormData.exam_end_date}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exam_end_time" className="text-sm font-medium">End Time</Label>
                <Input
                  id="exam_end_time"
                  name="exam_end_time"
                  type="time"
                  value={editFormData.exam_end_time}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium">Additional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-medium">Duration (minutes)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={editFormData.duration}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch" className="text-sm font-medium">Branch</Label>
                <Select
                  name="branch"
                  value={editFormData.branch}
                  onValueChange={(value) => handleSelectChange('branch', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester" className="text-sm font-medium">Semester</Label>
                <Select
                  name="semester"
                  value={editFormData.semester}
                  onValueChange={(value) => handleSelectChange('semester', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester} value={semester}>
                        {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="created_by" className="text-sm font-medium">Created By</Label>
                <Input
                  id="created_by"
                  name="created_by"
                  value={editFormData.created_by}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-6 border-t">
          <Button variant="outline" onClick={() => setShowEditDialog(false)} className="mr-2">
            Cancel
          </Button>
          <Button onClick={handleUpdate} className="bg-primary">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
        
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">
              Delete Exam
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Are you sure you want to do this? <br/>
              <span className="text-indigo-500 font-semibold">{deleteExam?.exam_name}</span> will be permanently deleted.
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
                onClick={() => handleDelete(deleteExam.id)}
              >
                Confirm
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShowExamModel;
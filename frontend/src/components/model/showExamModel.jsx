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
  const [editFormData, setEditFormData] = useState({
    exam_name: '',
    no_of_questions: '',
    exam_start_date: '',
    exam_start_time: '',
    exam_end_date: '',
    exam_end_time: '',
    college: '',
    total_marks: '',
    duration: '',
    created_by: ''
  });

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

  const handleUpdate = async () => {
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
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exam Name</TableHead>
              <TableHead className="text-center">College</TableHead>
              <TableHead className="text-center">Start Date</TableHead>
              <TableHead className="text-center">Duration</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.map((exam) => (
              <TableRow key={exam.id}>
                <TableCell className="font-medium">{exam.exam_name}</TableCell>
                <TableCell className="text-center">{exam.college}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Details Dialog */}
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
                  <p><span className="font-medium">Total Questions:</span> {selectedExam.no_of_questions}</p>
                  <p><span className="font-medium">Total Marks:</span> {selectedExam.total_marks}</p>
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

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Exam</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exam_name">Exam Name</Label>
                <Input
                  id="exam_name"
                  name="exam_name"
                  value={editFormData.exam_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="college">College</Label>
                <Input
                  id="college"
                  name="college"
                  value={editFormData.college}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="no_of_questions">Number of Questions</Label>
                <Input
                  id="no_of_questions"
                  name="no_of_questions"
                  type="number"
                  value={editFormData.no_of_questions}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_marks">Total Marks</Label>
                <Input
                  id="total_marks"
                  name="total_marks"
                  type="number"
                  value={editFormData.total_marks}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exam_start_date">Start Date</Label>
                <Input
                  id="exam_start_date"
                  name="exam_start_date"
                  type="date"
                  value={editFormData.exam_start_date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exam_start_time">Start Time</Label>
                <Input
                  id="exam_start_time"
                  name="exam_start_time"
                  type="time"
                  value={editFormData.exam_start_time}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exam_end_date">End Date</Label>
                <Input
                  id="exam_end_date"
                  name="exam_end_date"
                  type="date"
                  value={editFormData.exam_end_date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exam_end_time">End Time</Label>
                <Input
                  id="exam_end_time"
                  name="exam_end_time"
                  type="time"
                  value={editFormData.exam_end_time}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={editFormData.duration}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="created_by">Created By</Label>
                <Input
                  id="created_by"
                  name="created_by"
                  value={editFormData.created_by}
                  onChange={handleInputChange}
                />
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
        
      {/* Delete Dialog */}
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
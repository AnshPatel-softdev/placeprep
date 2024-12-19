import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ShowAttemptedExamsModel = ({ user }) => {
    const [attemptedExams, setAttemptedExams] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [filters, setFilters] = useState({
        examName: '',
        studentName: '',
        college: '',
        branch: '',
        examDate: '',
        passingStatus: 'ALL'
    });

    useEffect(() => {
        fetchAttemptedExams();
    }, []);

    const fetchAttemptedExams = async () => {
        try {
            const response = await axios.get('http://localhost:8081/attemptedexam', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            setAttemptedExams(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch attempted exams", error);
            setLoading(false);
        }
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value
        }));
    };

    const filteredExams = attemptedExams.filter(attempt => {
        return (
            (filters.examName === '' || 
                attempt.exam?.exam_name?.toLowerCase().includes(filters.examName.toLowerCase())) &&
            (filters.studentName === '' || 
                `${attempt.user?.firstname || ''} ${attempt.user?.lastname || ''}`.toLowerCase().includes(filters.studentName.toLowerCase()) ||
                attempt.user?.username?.toLowerCase().includes(filters.studentName.toLowerCase())) &&
            (filters.college === '' || attempt.user?.college?.toLowerCase().includes(filters.college.toLowerCase())) &&
            (filters.branch === '' || attempt.user?.branch?.toLowerCase().includes(filters.branch.toLowerCase())) &&
            (filters.examDate === '' || attempt.examDate?.includes(filters.examDate)) &&
            (filters.passingStatus === 'ALL' || attempt.passingStatus === filters.passingStatus)
        );
    });

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Attempted Exams</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center h-64">
                    <p>Loading attempted exams...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Attempted Exams</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-6 gap-4 mb-4">
                    <Input 
                        placeholder="Exam Name" 
                        value={filters.examName}
                        onChange={(e) => handleFilterChange('examName', e.target.value)}
                    />
                    <Input 
                        placeholder="Student Name" 
                        value={filters.studentName}
                        onChange={(e) => handleFilterChange('studentName', e.target.value)}
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
                    <Input 
                        type="date"
                        placeholder="Exam Date" 
                        value={filters.examDate}
                        onChange={(e) => handleFilterChange('examDate', e.target.value)}
                    />
                    <Select 
                        value={filters.passingStatus}
                        onValueChange={(value) => handleFilterChange('passingStatus', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Passing Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="Pass">Pass</SelectItem>
                            <SelectItem value="Fail">Fail</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {filteredExams.length === 0 ? (
                    <p className="text-center text-gray-500">No exams match the current filters.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Exam Name</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead>College</TableHead>
                                <TableHead>Branch</TableHead>
                                <TableHead>Exam Date</TableHead>
                                <TableHead>Submitted Time</TableHead>
                                <TableHead>Marks</TableHead>
                                <TableHead>Passing Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredExams.map((attempt) => (
                                <TableRow key={attempt.id}>
                                    <TableCell>{attempt.exam?.exam_name || 'N/A'}</TableCell>
                                    <TableCell>
                                        {`${attempt.user?.firstname || ''} ${attempt.user?.lastname || ''} (${attempt.user?.username || 'N/A'})`}
                                    </TableCell>
                                    <TableCell>{attempt.user?.college || 'N/A'}</TableCell>
                                    <TableCell>{attempt.user?.branch || 'N/A'}</TableCell>
                                    <TableCell>{attempt.examDate || 'N/A'}</TableCell>
                                    <TableCell>{attempt.submittedTime || 'N/A'}</TableCell>
                                    <TableCell>{`${attempt.obtainedMarks || 'N/A'}/${attempt.totalMarks || 'N/A'}`}</TableCell>
                                    <TableCell>
                                        <span 
                                            className={`p-1 rounded ${
                                                attempt.passingStatus === 'Pass' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {attempt.passingStatus || 'N/A'}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
};

export default ShowAttemptedExamsModel;
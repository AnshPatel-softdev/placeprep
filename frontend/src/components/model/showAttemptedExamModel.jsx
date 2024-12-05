import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ShowAttemptedExamsModel = ({ user }) => {
    const [attemptedExams, setAttemptedExams] = useState([]);
    const [loading, setLoading] = useState(true);

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
                {attemptedExams.length === 0 ? (
                    <p className="text-center text-gray-500">No attempted exams found.</p>
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
                            {attemptedExams.map((attempt) => (
                                <TableRow key={attempt.id}>
                                    <TableCell>{attempt.exam.exam_name}</TableCell>
                                    <TableCell>
                                        {`${attempt.user.firstname} ${attempt.user.lastname} (${attempt.user.username})`}
                                    </TableCell>
                                    <TableCell>{attempt.user.college}</TableCell>
                                    <TableCell>{attempt.user.branch}</TableCell>
                                    <TableCell>{attempt.examDate}</TableCell>
                                    <TableCell>{attempt.submittedTime}</TableCell>
                                    <TableCell>{`${attempt.obtainedMarks}/${attempt.totalMarks}`}</TableCell>
                                    <TableCell>
                                        <span 
                                            className={`p-1 rounded ${
                                                attempt.passingStatus === 'Pass' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {attempt.passingStatus}
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
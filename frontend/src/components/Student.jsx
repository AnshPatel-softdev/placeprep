import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap, ClipboardList, Award } from "lucide-react";
import ScheduledExams from './model/scheduledExamModel';

const StudentDashboard = ({ user, onStartExam }) => {
    const [activePanel, setActivePanel] = useState(null);
    

    const togglePanel = (panelName) => {
        setActivePanel(activePanel === panelName ? null : panelName);
    };

    const handleStartExam = (exam, questions) => {
        onStartExam(exam, questions);
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Student Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome, {user?.username}!</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {/* Student Profile Card */}
                    <div className="p-4 border rounded-lg bg-white shadow-sm">
                        <div className="flex items-center space-x-3">
                            <GraduationCap className="h-6 w-6 text-blue-500" />
                            <div>
                                <h3 className="font-medium">Your Details</h3>
                                <p className="text-sm text-gray-500">
                                    {user?.college || 'College Name'} - Sem {user?.semester || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Exams Card */}
                    <div className="p-4 border rounded-lg bg-white shadow-sm">
                        <div className="flex items-center space-x-3">
                            <ClipboardList className="h-6 w-6 text-green-500" />
                            <div>
                                <h3 className="font-medium">Upcoming Exams</h3>
                                <p className="text-sm text-gray-500">View your scheduled exams</p>
                            </div>
                        </div>
                    </div>

                    {/* Results Card */}
                    <div className="p-4 border rounded-lg bg-white shadow-sm">
                        <div className="flex items-center space-x-3">
                            <Award className="h-6 w-6 text-purple-500" />
                            <div>
                                <h3 className="font-medium">Results</h3>
                                <p className="text-sm text-gray-500">View your exam results</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
                <Button 
                    onClick={() => togglePanel('showExams')}
                    variant={activePanel === 'showExams' ? 'secondary' : 'default'}
                    className="flex items-center gap-2"
                >
                    <ClipboardList className="h-4 w-4" />
                    {activePanel === 'showExams' ? 'Hide Exams' : 'Show Available Exams'}
                </Button>

                <Button 
                    onClick={() => togglePanel('showResults')}
                    variant={activePanel === 'showResults' ? 'secondary' : 'default'}
                    className="flex items-center gap-2"
                >
                    <Award className="h-4 w-4" />
                    {activePanel === 'showResults' ? 'Hide Results' : 'View Results'}
                </Button>
            </div>

            <div className="mt-4">
                {activePanel === 'showExams' && (
                    <div className="bg-gray-50 rounded-lg p-4">
                    <ScheduledExams 
                        user={user} 
                        onStartExam={handleStartExam} 
                    />
                    </div>
                )}
                
                {activePanel === 'showResults' && (
                    <div className="bg-gray-50 rounded-lg p-4">
                        {/* Add your results component here */}
                        <p className="text-center text-gray-500">Results component will be displayed here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
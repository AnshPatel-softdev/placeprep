import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Menu, User, BookOpen, Award, History, ClipboardList } from 'lucide-react';
import ScheduledExams from './model/scheduledExamModel';

const StudentDashboard = ({ user, onStartExam }) => {
    const [activePanel, setActivePanel] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const togglePanel = (panelName) => {
        setActivePanel(activePanel === panelName ? null : panelName);
    };

    const navigationGroups = [
        {
            title: "Profile",
            icon: <User className="w-4 h-4" />,
            items: [
                { name: 'profile', label: 'My Profile', panel: 'profile' }
            ]
        },
        {
            title: "Exams",
            icon: <ClipboardList className="w-4 h-4" />,
            items: [
                { name: 'scheduledExams', label: 'Scheduled Exams', panel: 'scheduledExams' },
                { name: 'examHistory', label: 'Exam History', panel: 'examHistory' }
            ]
        },
        {
            title: "Results",
            icon: <Award className="w-4 h-4" />,
            items: [
                { name: 'results', label: 'View Results', panel: 'results' }
            ]
        }
    ];

    return (
        <div className="flex h-screen">
            <div className={`bg-slate-50 border-r ${isSidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
                <div className="p-4 flex justify-between items-center">
                    {!isSidebarCollapsed && <h2 className="font-semibold">Student Portal</h2>}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    >
                        <Menu className="h-4 w-4" />
                    </Button>
                </div>
                <Separator />
                <ScrollArea className="h-[calc(100vh-5rem)]">
                    <div className="p-2">
                        {navigationGroups.map((group, index) => (
                            <div key={group.title} className="mb-4">
                                <div className="flex items-center px-2 py-1">
                                    {group.icon}
                                    {!isSidebarCollapsed && (
                                        <span className="ml-2 text-sm font-medium">{group.title}</span>
                                    )}
                                </div>
                                {group.items.map((item) => (
                                    <Button
                                        key={item.name}
                                        variant={activePanel === item.panel ? 'secondary' : 'ghost'}
                                        className={`w-full justify-start mb-1 ${isSidebarCollapsed ? 'px-2' : 'px-4'}`}
                                        onClick={() => togglePanel(item.panel)}
                                    >
                                        {isSidebarCollapsed ? (
                                            <span className="w-4 h-4">{item.label.charAt(0)}</span>
                                        ) : (
                                            <span className="text-sm">{item.label}</span>
                                        )}
                                    </Button>
                                ))}
                                {index < navigationGroups.length - 1 && <Separator className="my-2" />}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
                    <p className="mb-4">Welcome, {user?.username}!</p>

                    <div className="mt-4">
                        {activePanel === 'profile' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <h2 className="text-xl font-semibold mb-4">Student Profile</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-500">Name</label>
                                            <p className="font-medium">{user?.username}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">Student ID</label>
                                            <p className="font-medium">{user?.id}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">College</label>
                                            <p className="font-medium">{user?.college}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">Semester</label>
                                            <p className="font-medium">Sem {user?.semester}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                        <div className="flex items-center space-x-3">
                                            <BookOpen className="h-6 w-6 text-blue-500" />
                                            <div>
                                                <h3 className="font-medium">Upcoming Exams</h3>
                                                <p className="text-sm text-gray-500">View scheduled exams</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                        <div className="flex items-center space-x-3">
                                            <Award className="h-6 w-6 text-green-500" />
                                            <div>
                                                <h3 className="font-medium">Recent Results</h3>
                                                <p className="text-sm text-gray-500">Check your performance</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                        <div className="flex items-center space-x-3">
                                            <History className="h-6 w-6 text-purple-500" />
                                            <div>
                                                <h3 className="font-medium">Exam History</h3>
                                                <p className="text-sm text-gray-500">View past attempts</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {activePanel === 'scheduledExams' && (
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h2 className="text-xl font-semibold mb-4">Scheduled Exams</h2>
                                <ScheduledExams user={user} onStartExam={onStartExam} />
                            </div>
                        )}

                        {activePanel === 'examHistory' && (
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h2 className="text-xl font-semibold mb-4">Exam History</h2>
                                <div className="text-center text-gray-500">
                                    <p>Your exam history will be displayed here</p>
                                </div>
                            </div>
                        )}

                        {activePanel === 'results' && (
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h2 className="text-xl font-semibold mb-4">Exam Results</h2>
                                <div className="text-center text-gray-500">
                                    <p>Your exam results will be displayed here</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
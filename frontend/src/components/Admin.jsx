import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Menu, Users, FileText, Code, Table, ClipboardList, Activity, Clock, Database } from 'lucide-react';
import AddUserModel from './model/addUserModel';
import AddQuestionModel from './model/addQuestionModel';
import ShowUserModel from './model/showUserModel';
import ShowQuestionModel from './model/showQuestionModel';
import ExcelUploadModel from './model/excelUploadModel';
import AddExamModel from './model/addExamModel';
import ShowExamModel from './model/showExamModel';
import ShowAttemptedExamsModel from './model/showAttemptedExamModel';
import ExamManagement from './model/examManagementModel';
import ShowAttemptedQuestionsModel from './model/showAttemptedQuestionModel';
import AddProgrammingQuestionModel from './model/addProgrammingQuestionModel';
import ShowProgrammingQuestionModel from './model/showProgrammingQuestionModel';
import ShowAttemptedProgrammingQuestionModel from './model/showAttemptedProgrammingQuestionModel';
import UserLoginDetails from './model/showUserLogModel';

const AdminDashboard = ({ user }) => {
    const [activePanel, setActivePanel] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const togglePanel = (panelName) => {
        setActivePanel(activePanel === panelName ? null : panelName);
    };

    const navigationGroups = [
        {
            title: "User Management",
            icon: <Users className="w-4 h-4" />,
            items: [
                { name: 'addUser', label: 'Add New User', panel: 'addUser' },
                { name: 'addUserExcel', label: 'Add Users via Excel', panel: 'addUserExcel' },
                { name: 'showUsers', label: 'Show Users', panel: 'showUsers' },
                { name: 'showUserLog', label: 'User Logs', panel: 'showUserLog' }
            ]
        },
        {
            title: "Question Bank",
            icon: <FileText className="w-4 h-4" />,
            items: [
                { name: 'addQuestion', label: 'Add New Question', panel: 'addQuestion' },
                { name: 'addQuestionExcel', label: 'Add Questions via Excel', panel: 'addQuestionExcel' },
                { name: 'showQuestions', label: 'Show Questions', panel: 'showQuestions' }
            ]
        },
        {
            title: "Programming Questions",
            icon: <Code className="w-4 h-4" />,
            items: [
                { name: 'addProgrammingQuestion', label: 'Add Programming Question', panel: 'addProgrammingQuestion' },
                { name: 'showProgrammingQuestions', label: 'Show Programming Questions', panel: 'showProgrammingQuestions' }
            ]
        },
        {
            title: "Exam Management",
            icon: <ClipboardList className="w-4 h-4" />,
            items: [
                { name: 'scheduleExam', label: 'Schedule Exam', panel: 'scheduleExam' },
                { name: 'showExams', label: 'Show Exams', panel: 'showExams' },
                { name: 'examManagement', label: 'Exam Management', panel: 'examManagement' }
            ]
        },
        {
            title: "Results & Analysis",
            icon: <Activity className="w-4 h-4" />,
            items: [
                { name: 'showAttemptedExams', label: 'Attempted Exams', panel: 'showAttemptedExams' },
                { name: 'showAttemptedQuestion', label: 'Attempted Questions', panel: 'showAttemptedQuestion' },
                { name: 'showAttemptedProgrammingQuestion', label: 'Attempted Programming Questions', panel: 'showAttemptedProgrammingQuestion' }
            ]
        }
    ];

    return (
        <div className="flex h-screen">
            <div className={`bg-slate-50 border-r ${isSidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
                <div className="p-4 flex justify-between items-center">
                    {!isSidebarCollapsed && <h2 className="font-semibold">Admin Panel</h2>}
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
                    <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
                    <p className="mb-4">Welcome, {user?.username}!</p>

                    <div className="mt-4">
                        {activePanel === 'addUser' && <AddUserModel setShowUserForm={() => setActivePanel(null)} user={user} />}
                        {activePanel === 'addUserExcel' && <ExcelUploadModel type="users" onClose={() => setActivePanel(null)} user={user} />}
                        {activePanel === 'addQuestion' && <AddQuestionModel setShowQuestionForm={() => setActivePanel(null)} user={user} />}
                        {activePanel === 'addProgrammingQuestion' && <AddProgrammingQuestionModel setShowQuestionForm={() => setActivePanel(null)} user={user} />}
                        {activePanel === 'addQuestionExcel' && <ExcelUploadModel type="questions" onClose={() => setActivePanel(null)} user={user} />}
                        {activePanel === 'scheduleExam' && <AddExamModel setShowExamForm={() => setActivePanel(null)} user={user} />}
                        {activePanel === 'showUsers' && <ShowUserModel user={user} />}
                        {activePanel === 'showQuestions' && <ShowQuestionModel user={user} />}
                        {activePanel === 'showProgrammingQuestions' && <ShowProgrammingQuestionModel user={user} />}
                        {activePanel === 'showExams' && <ShowExamModel user={user} />}
                        {activePanel === 'showAttemptedExams' && <ShowAttemptedExamsModel user={user} />}
                        {activePanel === 'examManagement' && <ExamManagement user={user} />}
                        {activePanel === 'showAttemptedQuestion' && <ShowAttemptedQuestionsModel user={user} />}
                        {activePanel === 'showAttemptedProgrammingQuestion' && <ShowAttemptedProgrammingQuestionModel user={user} />}
                        {activePanel === 'showUserLog' && <UserLoginDetails user={user} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
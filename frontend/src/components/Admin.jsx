import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AddUserModel from './model/addUserModel';
import AddQuestionModel from './model/addQuestionModel';
import ShowUserModel from './model/showUserModel';
import ShowQuestionModel from './model/showQuestionModel';
import ExcelUploadModel from './model/excelUploadModel';
import AddExamModel from './model/addExamModel';
import ShowExamModel from './model/showExamModel';
import ShowAttemptedExamsModel from './model/showAttemptedExamModel';

const AdminDashboard = ({ user }) => {
    const [activePanel, setActivePanel] = useState(null);

    const togglePanel = (panelName) => {
        setActivePanel(activePanel === panelName ? null : panelName);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
            <p className="mb-4">Welcome, {user?.username}!</p>

            <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex gap-2">
                    <Button 
                        onClick={() => togglePanel('addUser')}
                        variant={activePanel === 'addUser' ? 'secondary' : 'default'}
                    >
                        {activePanel === 'addUser' ? 'Cancel' : 'Add New User'}
                    </Button>

                    <Button 
                        onClick={() => togglePanel('addUserExcel')}
                        variant={activePanel === 'addUserExcel' ? 'secondary' : 'default'}
                    >
                        {activePanel === 'addUserExcel' ? 'Cancel' : 'Add Users via Excel'}
                    </Button>
                </div>

                <div className="flex gap-2">
                    <Button 
                        onClick={() => togglePanel('addQuestion')}
                        variant={activePanel === 'addQuestion' ? 'secondary' : 'default'}
                    >
                        {activePanel === 'addQuestion' ? 'Cancel' : 'Add New Question'}
                    </Button>

                    <Button 
                        onClick={() => togglePanel('addQuestionExcel')}
                        variant={activePanel === 'addQuestionExcel' ? 'secondary' : 'default'}
                    >
                        {activePanel === 'addQuestionExcel' ? 'Cancel' : 'Add Questions via Excel'}
                    </Button>
                </div>

                <div className="flex gap-2">
                    <Button 
                        onClick={() => togglePanel('scheduleExam')}
                        variant={activePanel === 'scheduleExam' ? 'secondary' : 'default'}
                    >
                        {activePanel === 'scheduleExam' ? 'Cancel' : 'Schedule Exam'}
                    </Button>
                    
                    <Button 
                        onClick={() => togglePanel('showExams')}
                        variant={activePanel === 'showExams' ? 'secondary' : 'default'}
                    >
                        {activePanel === 'showExams' ? 'Cancel' : 'Show Exams'}
                    </Button>
                </div>

                <div className="flex gap-2">
                    <Button 
                        onClick={() => togglePanel('showUsers')}
                        variant={activePanel === 'showUsers' ? 'secondary' : 'default'}
                    >
                        {activePanel === 'showUsers' ? 'Cancel' : 'Show Users'}
                    </Button>

                    <Button 
                        onClick={() => togglePanel('showQuestions')}
                        variant={activePanel === 'showQuestions' ? 'secondary' : 'default'}
                    >
                        {activePanel === 'showQuestions' ? 'Cancel' : 'Show Questions'}
                    </Button>

                    <Button 
                        onClick={() => togglePanel('showAttemptedExams')}
                        variant={activePanel === 'showAttemptedExams' ? 'secondary' : 'default'}
                    >
                        {activePanel === 'showAttemptedExams' ? 'Cancel' : 'Show Attempted Exams'}
                    </Button>
                </div>
            </div>

            <div className="mt-4">
                {activePanel === 'addUser' && (
                    <AddUserModel 
                        setShowUserForm={() => setActivePanel(null)} 
                        user={user}
                    />
                )}
                
                {activePanel === 'addUserExcel' && (
                    <ExcelUploadModel 
                        type="users"
                        onClose={() => setActivePanel(null)}
                        user={user}
                    />
                )}
                
                {activePanel === 'addQuestion' && (
                    <AddQuestionModel 
                        setShowQuestionForm={() => setActivePanel(null)} 
                        user={user}
                    />
                )}
                
                {activePanel === 'addQuestionExcel' && (
                    <ExcelUploadModel 
                        type="questions"
                        onClose={() => setActivePanel(null)}
                        user={user}
                    />
                )}
                
                {activePanel === 'scheduleExam' && (
                    <AddExamModel 
                        setShowExamForm={() => setActivePanel(null)}
                        user={user}
                    />
                )}
                
                {activePanel === 'showUsers' && (
                    <ShowUserModel user={user} />
                )}
                
                {activePanel === 'showQuestions' && (
                    <ShowQuestionModel user={user} />
                )}

                {activePanel === 'showExams' && (
                    <ShowExamModel user={user} />
                )}

                {activePanel === 'showAttemptedExams' && (
                    <ShowAttemptedExamsModel user={user} />
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
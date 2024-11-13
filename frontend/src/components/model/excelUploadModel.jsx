import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

const ExcelUploadModel = ({ type, onClose, user }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [preview, setPreview] = useState([]);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
            setError('Please upload an Excel file (.xlsx or .xls)');
            return;
        }

        setFile(selectedFile);
        setError(null);
        setPreview([]);
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file); // Make sure to append with the key 'file'

            const endpoint = type === 'users' 
                ? 'http://localhost:8081/user/upload-users' 
                : 'http://localhost:8081/question/upload-questions';

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                throw new Error(data?.message || 'Upload failed');
            }

            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (err) {
            setError(err.message || 'Failed to upload file');
        } finally {
            setLoading(false);
        }
    };

    const downloadTemplate = () => {
        const templateUrl = type === 'users' 
            ? '/templates/users-template.xlsx'
            : '/templates/questions-template.xlsx';
        
        window.open(templateUrl, '_blank');
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>
                    Upload {type === 'users' ? 'Users' : 'Questions'} via Excel
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Button 
                        variant="outline" 
                        onClick={downloadTemplate}
                    >
                        Download Template
                    </Button>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                            className="hidden"
                            id="excel-upload"
                        />
                        <label 
                            htmlFor="excel-upload"
                            className="cursor-pointer flex flex-col items-center"
                        >
                            <Upload className="h-12 w-12 text-gray-400" />
                            <p className="mt-2">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-sm text-gray-500">
                                Excel files only (.xlsx, .xls)
                            </p>
                        </label>
                    </div>

                    {file && (
                        <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>{file.name}</span>
                        </div>
                    )}

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertDescription>
                                Upload successful! Closing...
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="flex justify-end gap-4">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={!file || loading}
                        >
                            {loading ? 'Uploading...' : 'Upload'}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ExcelUploadModel;
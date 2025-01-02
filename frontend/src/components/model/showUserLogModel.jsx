import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, User, Clock, School } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";

const UserLoginDetails = ({user}) => {
  const [userLogs, setUserLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchUserLogs();
  }, []);

  const fetchUserLogs = async () => {
    try {
      const response = await fetch('http://localhost:8081/userlog',{
        headers:{
            'Authorization':`Bearer ${user.token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setUserLogs(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user logs:', err);
      setError('Failed to load user login details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsDialog(true);
  };

  if (loading) {
    return <div className="p-4">Loading user login details...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Login Details</h2>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">
                  {log.user.firstname} {log.user.lastname}
                </TableCell>
                <TableCell>
                  <Badge variant={log.user.role === 'ADMIN' ? 'destructive' : 'secondary'}>
                    {log.user.role}
                  </Badge>
                </TableCell>
                <TableCell>{log.user.username}</TableCell>
                <TableCell>{formatDate(log.loginTime)}</TableCell>
                <TableCell className="text-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleViewDetails(log)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View details</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold text-lg">Personal Information</h3>
                </div>
                <div className="grid gap-2 pl-7">
                  <p className="text-gray-700 text-lg">
                    {selectedUser.user.firstname} {selectedUser.user.lastname}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Username:</span> {selectedUser.user.username}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Email:</span> {selectedUser.user.email}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Role:</span>{' '}
                    <Badge variant={selectedUser.user.role === 'ADMIN' ? 'destructive' : 'secondary'}>
                      {selectedUser.user.role}
                    </Badge>
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <School className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold text-lg">Academic Details</h3>
                </div>
                <div className="grid gap-2 pl-7">
                  <p className="text-gray-700">
                    <span className="font-medium">College:</span> {selectedUser.user.college || 'Not specified'}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Branch:</span> {selectedUser.user.branch || 'Not specified'}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Semester:</span> {selectedUser.user.semester || 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  <h3 className="font-semibold text-lg">Timestamps</h3>
                </div>
                <div className="grid gap-2 pl-7">
                  <p className="text-gray-700">
                    <span className="font-medium">Last Login:</span> {formatDate(selectedUser.loginTime)}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Account Created:</span> {formatDate(selectedUser.user.created_at)}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Last Updated:</span> {formatDate(selectedUser.user.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserLoginDetails;
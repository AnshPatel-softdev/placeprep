import { useEffect, useState } from 'react';
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
import { Pencil, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ShowUserModel = ({user}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [filters, setFilters] = useState({
    username: '',
    role: 'ALL',
    college: '',
    branch: ''
  });

  const [editFormData, setEditFormData] = useState({
    id: '',
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    email: '',
    role: '',
    college: '',
    branch: '',
    semester: ''
  });

  const roles = ['ADMIN', 'STUDENT'];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8081/user', {
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
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
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

  const filteredUsers = users.filter(user => {
    return (
      (filters.username === '' || 
        user.username.toLowerCase().includes(filters.username.toLowerCase())) &&
      (filters.role === 'ALL' || 
        user.role?.toLowerCase() === filters.role.toLowerCase()) &&
      (filters.college === '' || 
        user.college?.toLowerCase().includes(filters.college.toLowerCase())) &&
      (filters.branch === '' || 
        user.branch?.toLowerCase().includes(filters.branch.toLowerCase()))
    );
  });

  const handleEdit = (selectedUser) => {
    setEditFormData({
      id: selectedUser.id,
      username: selectedUser.username,
      password: '',
      firstname: selectedUser.firstname,
      lastname: selectedUser.lastname,
      email: selectedUser.email,
      role: selectedUser.role,
      college: selectedUser.college || '',
      branch: selectedUser.branch || '',
      semester: selectedUser.semester || ''
    });
    setShowEditDialog(true);
  };

  const handleDeleteDialog = (user) => {
    setDeleteUser(user)
    setShowDeleteDialog(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      const updateData = {
        ...editFormData,
        ...(editFormData.password ? { password: editFormData.password } : {})
      };
      
      const response = await fetch(`http://localhost:8081/user/${editFormData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setUsers(users.map(u => 
        u.id === editFormData.id ? { ...u, ...updateData } : u
      ));
      
      setShowEditDialog(false);
      setError(null);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user. Please try again.');
    }
  };
  
  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8081/user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setShowDeleteDialog(false)
      setDeleteUser({})
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
    }
  };

  const handleClose = () => {
    setDeleteUser({})
    setShowDeleteDialog(false)
  }

  if (loading) {
    return <div className="p-4">Loading users...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-4 gap-4 mb-4">
        <Input 
          placeholder="Username" 
          value={filters.username}
          onChange={(e) => handleFilterChange('username', e.target.value)}
        />
        <Select 
          value={filters.role}
          onValueChange={(value) => handleFilterChange('role', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">FirstName</TableHead>
              <TableHead className="text-center">LastName</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Role</TableHead>
              <TableHead className="text-center">College</TableHead>
              <TableHead className="text-center">Branch</TableHead>
              <TableHead className="text-center">Semester</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan="8" className="text-center text-gray-500">
                  No users match the current filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-center">{user.firstname}</TableCell>
                  <TableCell className="font-medium text-center">{user.lastname}</TableCell>
                  <TableCell className="text-center">{user.email}</TableCell>
                  <TableCell className="text-center">{user.role}</TableCell>
                  <TableCell className="text-center">{user.college || 'N/A'}</TableCell>
                  <TableCell className="text-center">{user.branch || 'N/A'}</TableCell>
                  <TableCell className="text-center">{user.semester || 'N/A'}</TableCell>
                  <TableCell className="text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(user)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit user</p>
                        </TooltipContent>
                      </Tooltip>  

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteDialog(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete user</p>
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

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={editFormData.username}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password (leave empty to keep current)
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={editFormData.password}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  id="firstname"
                  name="firstname"
                  value={editFormData.firstname}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  name="lastname"
                  value={editFormData.lastname}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={editFormData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={editFormData.role}
                onValueChange={(value) => handleInputChange({ target: { name: 'role', value } })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="STUDENT">STUDENT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {editFormData.role === 'STUDENT' && (
              <>
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
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    name="branch"
                    value={editFormData.branch}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Select
                    value={editFormData.semester}
                    onValueChange={(value) => handleInputChange({ target: { name: 'semester', value } })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>
                          Semester {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
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
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete User
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? <br/>
            <span className="text-indigo-500 font-semibold">#{deleteUser?.username}</span> will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button
              onClick={() => {handleClose()}}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {handleDelete(deleteUser.id)}}
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

export default ShowUserModel;
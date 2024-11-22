import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

const AddUserModel = ({setShowUserForm, user}) => {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    role: 'STUDENT',
    email: '',
    firstname: '',
    lastname: '',
    college: '',
    branch: '',
    semester: 1,
    created_at: '',
    updated_at: '',
  });

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    userData.semester = parseInt(userData.semester)
    try {
      const response = await fetch('http://localhost:8081/user/save', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Failed to create user');
      setShowUserForm(false);
      setUserData({
        username: '',
        password: '',
        role: 'STUDENT',
        email: '',
        firstname: '',
        lastname: '',
        college: '',
        branch: '',
        semester: 1,
        created_at: '',
        updated_at: '',
      });
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  return (
    <>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUserSubmit} className="space-y-4">
            <Input
              placeholder="Username"
              value={userData.username}
              onChange={(e) => setUserData({ ...userData, username: e.target.value })}
            />
            <Input
              type="password"
              placeholder="Password"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            />
            <Select
              value={userData.role}
              onValueChange={(value) => setUserData({ ...userData, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STUDENT">Student</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="email"
              placeholder="Email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            />
            <Input
              placeholder="First Name"
              value={userData.firstname}
              onChange={(e) => setUserData({ ...userData, firstname: e.target.value })}
            />
            <Input
              placeholder="Last Name"
              value={userData.lastname}
              onChange={(e) => setUserData({ ...userData, lastname: e.target.value })}
            />
            {/* New fields for college, branch, and semester */}
            <Input
              placeholder="College"
              value={userData.college}
              onChange={(e) => setUserData({ ...userData, college: e.target.value })}
            />
            <Input
              placeholder="Branch"
              value={userData.branch}
              onChange={(e) => setUserData({ ...userData, branch: e.target.value })}
            />
            <Select
              value={userData.semester}
              onValueChange={(value) => setUserData({ ...userData, semester: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <SelectItem key={sem} value={sem.toString()}>
                    Semester {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">Create User</Button>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default AddUserModel;
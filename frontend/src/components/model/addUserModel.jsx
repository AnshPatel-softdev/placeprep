import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';

const AddUserModel = ({setShowUserForm,user}) => {

const [userData, setUserData] = useState({
    username: '',
    password: '',
    role: 'STUDENT',
    email: '',
    firstname: '',
    lastname: '',
    created_at: '',
    updated_at: '',
  });


  const handleUserSubmit = async (e) => {
    e.preventDefault();
    console.log(user.token)
    try {
      const response = await fetch('http://localhost:8081/user/save', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`, // Use the token here
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
        firstname:'',
        lastname:'',
        created_at:'',
        updated_at:'',
      });
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  return(
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
                <SelectTrigger>Role</SelectTrigger>
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
              <Button type="submit">Create User</Button>
            </form>
          </CardContent>
        </Card>
      </>
  )}

  export default AddUserModel;
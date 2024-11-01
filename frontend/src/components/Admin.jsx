import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
const AdminDashboard = ({ user }) => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
      username: '',
      password: '',
      role: 'STUDENT',
      email: '',
      firstname:'',
      lastname:'',
      created_at:'',
      updated_at:'',
    });
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log(formData)
      try {
        const response = await fetch('http://localhost:8081/api/user/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Failed to create user');
        setShowForm(false);
        setFormData({
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
  
    const handleFileUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const response = await fetch('http://localhost:8081/api/users/import', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) throw new Error('Failed to import users');
        alert('Users imported successfully!');
      } catch (err) {
        console.error('Error importing users:', err);
      }
    };
  
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <p className="mb-4">Welcome, {user?.username}!</p>
        
        <div className="space-y-4">
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add New User'}
          </Button>
          
          {/* <div>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="excel-upload"
            />
            <Button onClick={() => document.getElementById('excel-upload').click()} variant="outline">
              Import Users from Excel
            </Button>
          </div>
   */}
          {showForm && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Add New User</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <Input
                    placeholder="FirstName"
                    value={formData.firstname}
                    onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                  />
                  <Input
                    placeholder="LastName"
                    value={formData.lastname}
                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                  />
                  <Button type="submit">Create User</Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };
  
  export default AdminDashboard;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LogOut, User, Mail, Shield, UserCheck, 
  Users, BookOpen, FileText, BarChart3, 
  PlusCircle, Settings 
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
    // Redirect if not instructor
    if (!loading && user && user.role !== 'INSTRUCTOR') {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <Layout>
        <div className="section-padding min-h-[calc(100vh-200px)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <Layout>
      <div className="section-padding min-h-[calc(100vh-200px)]">
        <div className="container-main">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Instructor Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back, {user.firstName}! Manage your courses and students.
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Students
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-1">Across all courses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Courses
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-1">Currently teaching</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Assignments
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-1">Pending reviews</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg. Performance
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--%</div>
                <p className="text-xs text-muted-foreground mt-1">Class average</p>
              </CardContent>
            </Card>
          </div>

          {/* User Info Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col items-center sm:items-start">
                  <Avatar className="w-20 h-20 mb-4">
                    <AvatarImage src={user.profileImageUrl} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback className="text-lg">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Role</p>
                        <p className="font-medium">{user.role || 'Instructor'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Provider</p>
                        <p className="font-medium capitalize">{user.provider || 'Local'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardContent className="pt-0">
              <Button 
                onClick={() => navigate('/profile')} 
                className="w-full"
                variant="outline"
              >
                View/Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PlusCircle className="h-5 w-5" />
                  Create Course
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Set up a new course for your students with requirements analysis
                </CardDescription>
                <Button className="w-full">
                  New Course
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Manage Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  View, add, or remove students from your courses
                </CardDescription>
                <Button className="w-full" variant="outline">
                  View Students
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Review Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Grade and provide feedback on student assignments
                </CardDescription>
                <Button className="w-full" variant="outline">
                  View Submissions
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  View Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Track student progress and course performance metrics
                </CardDescription>
                <Button className="w-full" variant="outline">
                  Open Analytics
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Course Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Upload and manage course materials and resources
                </CardDescription>
                <Button className="w-full" variant="outline">
                  Manage Materials
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Update your profile and configure course settings
                </CardDescription>
                <Button className="w-full" variant="outline">
                  Open Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InstructorDashboard;

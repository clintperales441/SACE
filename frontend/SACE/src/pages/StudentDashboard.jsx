import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LogOut, User, Mail, Shield, UserCheck, 
  BookOpen, FileText, Award, Calendar,CheckCircle, 
  Upload, BarChart3, Settings,
  GraduationCap
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
    // Redirect if not student
    if (!loading && user && user.role !== 'STUDENT') {
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

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BookOpen },
    { id: 'submissions', label: 'Submissions', icon: Upload },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-200px)]">
        {/* Sidebar */}
        <div className="w-48 bg-light-gray dark:bg-card border-r border-border p-4">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'submissions') {
                      navigate('/submissions');
                    } else {
                      setActiveSection(item.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {activeSection === 'dashboard' && (
            <div className="max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Welcome back, {user.firstName}!
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Continue your learning journey with SRS analysis
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-l-4 border-primary rounded-lg p-4 mt-4">
          <p className="text-foreground/80 text-sm">
            <strong>How It Works:</strong> Upload your SRS documents and get instant AI-powered feedback on completeness, consistency, and quality standards compliance.
          </p>
        </div>
      </div>

      {/* Feature Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* File Type Support Card */}
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-lg">File Type Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center gap-6">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-2 border-border rounded-lg flex items-center justify-center mb-2">
                  <FileText className="h-8 w-8 text-foreground/70" />
                </div>
                <span className="text-sm font-medium">PDF</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-2 border-border rounded-lg flex items-center justify-center mb-2">
                  <FileText className="h-8 w-8 text-foreground/70" />
                </div>
                <span className="text-sm font-medium">DOC</span>
              </div>
            </div>
            <div className="text-center pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground">Maximum file size: 10 MB</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-center text-muted-foreground">Submit as</p>
              <Button variant="outline" className="w-full" onClick={() => navigate('/submissions')}>
                Upload file
              </Button>
              <Button variant="outline" className="w-full gap-2" onClick={() => navigate('/submissions')}>
                <Upload className="h-4 w-4" />
                Attach your link
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* What We Check Card */}
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-lg">What We Check?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 h-5 w-5 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-foreground/70" />
              </div>
              <span className="text-sm">Completeness</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 h-5 w-5 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-foreground/70" />
              </div>
              <span className="text-sm">Consistency</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 h-5 w-5 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-foreground/70" />
              </div>
              <span className="text-sm">IEEE 830-1998 and ISO/IEC 29148</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 h-5 w-5 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-foreground/70" />
              </div>
              <span className="text-sm">Ambiguity Detection</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 h-5 w-5 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-foreground/70" />
              </div>
              <span className="text-sm">Image Check</span>
            </div>
          </CardContent>
        </Card>

        {/* Overall Quality Score Card */}
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-lg">Overall quality score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="w-32 h-32 border-4 border-border rounded-2xl flex items-center justify-center mb-4">
              <FileText className="h-16 w-16 text-foreground/70" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Upload your document to see the quality score
            </p>
          </CardContent>
        </Card>
      </div>
            </div>
          )}

          {activeSection === 'analytics' && (
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Analytics
                </h1>
                <p className="text-muted-foreground">
                  Track your submission performance and insights.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Submission Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center text-muted-foreground py-12">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No data available yet</p>
                      <p className="text-sm mt-2">Submit documents to see analytics</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Score Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center text-muted-foreground py-12">
                      <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No scores yet</p>
                      <p className="text-sm mt-2">Approved submissions will show here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Settings
                </h1>
                <p className="text-muted-foreground">
                  Manage your account settings and preferences.
                </p>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">First Name</label>
                        <p className="mt-1 font-medium">{user?.firstName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                        <p className="mt-1 font-medium">{user?.lastName}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="mt-1 font-medium">{user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Role</label>
                      <p className="mt-1 font-medium">{user?.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Submission Updates</p>
                        <p className="text-sm text-muted-foreground">Get notified about submission status</p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;

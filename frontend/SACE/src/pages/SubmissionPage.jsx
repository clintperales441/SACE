import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Upload, FileText, Link, Trash2, Eye, RefreshCw,
  CheckCircle, XCircle, Clock, AlertCircle, BookOpen, BarChart3, Settings, RotateCcw
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import api from '@/lib/api';

const SubmissionPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [driveLink, setDriveLink] = useState('');
  const [uploadMethod, setUploadMethod] = useState('file'); // 'file' or 'link'
  const [alert, setAlert] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'approved', 'declined'
  const [activeSection, setActiveSection] = useState('submissions');
  const [resubmitDialogOpen, setResubmitDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [resubmitLink, setResubmitLink] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
    if (!loading && user && user.role !== 'STUDENT') {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchSubmissions();
    }
  }, [user]);

  const fetchSubmissions = async () => {
    try {
      console.log('Fetching submissions from:', '/submissions');
      const response = await api.get('/submissions');
      console.log('Submissions response:', response.data);
      setSubmissions(response.data);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
      console.error('Error details:', error.response);
      showAlert('Failed to load submissions', 'error');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      showAlert('Please select a file to upload', 'error');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await api.post('/submissions/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSubmissions([response.data, ...submissions]);
      setSelectedFile(null);
      showAlert('File uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      showAlert(error.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleLinkUpload = async () => {
    if (!driveLink.trim()) {
      showAlert('Please enter a Google Drive link', 'error');
      return;
    }

    setUploading(true);
    try {
      const response = await api.post('/submissions/link', { driveLink: driveLink.trim() });
      setSubmissions([response.data, ...submissions]);
      setDriveLink('');
      showAlert('Link submitted successfully!');
    } catch (error) {
      console.error('Link submission failed:', error);
      showAlert(error.response?.data?.message || 'Link submission failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    setSubmissionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!submissionToDelete) return;

    try {
      await api.delete(`/submissions/${submissionToDelete}`);
      setSubmissions(submissions.filter(sub => sub.id !== submissionToDelete));
      showAlert('Submission deleted successfully!');
      setDeleteDialogOpen(false);
      setSubmissionToDelete(null);
    } catch (error) {
      console.error('Delete failed:', error);
      showAlert('Failed to delete submission', 'error');
    }
  };

  const handleResubmit = (submission) => {
    setSelectedSubmission(submission);
    setResubmitLink('');
    setResubmitDialogOpen(true);
  };

  const handleResubmitDocument = async () => {
    if (!resubmitLink.trim()) {
      showAlert('Please enter a Google Drive link', 'error');
      return;
    }

    setUploading(true);
    try {
      const response = await api.post('/submissions/link', { driveLink: resubmitLink.trim() });
      setSubmissions([response.data, ...submissions]);
      setResubmitLink('');
      setResubmitDialogOpen(false);
      showAlert('Document resubmitted successfully!');
    } catch (error) {
      console.error('Resubmit failed:', error);
      showAlert(error.response?.data?.message || 'Resubmit failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'UNDER_REVIEW':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return 'bg-yellow-100 text-yellow-800';
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatSubmissionStatus = (status) => {
    const statusMap = {
      'SUBMITTED': 'Pending',
      'UNDER_REVIEW': 'Pending',
      'APPROVED': 'Approved',
      'REJECTED': 'Declined'
    };
    return statusMap[status] || status;
  };

  const getFilteredSubmissions = () => {
    if (statusFilter === 'all') return submissions;
    
    return submissions.filter(submission => {
      const formattedStatus = formatSubmissionStatus(submission.status).toLowerCase();
      return formattedStatus === statusFilter;
    });
  };

  const getSubmissionScore = (submission) => {
    // Generate a mock score based on analysis
    // In a real app, this would come from actual analysis results
    if (submission.status === 'APPROVED') {
      return Math.floor(Math.random() * 20) + 80; // 80-100%
    } else if (submission.status === 'REJECTED') {
      return '-';
    }
    return '-';
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  if (loadingSubmissions) {
    return (
      <Layout>
        <div className="section-padding min-h-[calc(100vh-200px)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading submissions...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BookOpen },
    { id: 'submissions', label: 'Submissions', icon: FileText },
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
                    if (item.id === 'dashboard') {
                      navigate('/dashboard');
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
          {activeSection === 'submissions' && (
            <div className="max-w-6xl mx-auto">{/* Header */}
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              SRS Document Submissions
            </h1>
            <p className="text-muted-foreground">
              Upload your Software Requirements Specification documents for automated analysis and feedback.
            </p>
          </div>

          {/* Alert */}
          {alert && (
            <Alert className={`mb-6 ${alert.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
              <AlertDescription className={alert.type === 'error' ? 'text-red-800' : 'text-green-800'}>
                {alert.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Upload Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Submit New Document</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Upload Method Selection */}
                <div className="flex gap-4">
                  <Button
                    variant={uploadMethod === 'file' ? 'default' : 'outline'}
                    onClick={() => setUploadMethod('file')}
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                  <Button
                    variant={uploadMethod === 'link' ? 'default' : 'outline'}
                    onClick={() => setUploadMethod('link')}
                    className="flex-1"
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Google Drive Link
                  </Button>
                </div>

                {/* File Upload */}
                {uploadMethod === 'file' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="file">Select PDF or DOCX file (max 10MB)</Label>
                      <div className="relative mt-1">
                        <Input
                          id="file"
                          type="file"
                          accept=".pdf,.docx"
                          onChange={(e) => setSelectedFile(e.target.files[0])}
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                        />
                        <div className="flex items-center gap-3 border rounded-md p-2 bg-white">
                          <Button
                            type="button"
                            className="bg-primary hover:bg-primary/90 pointer-events-none"
                            size="sm"
                          >
                            Browse...
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            {selectedFile ? selectedFile.name : 'No file selected.'}
                          </span>
                        </div>
                      </div>
                      {selectedFile && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={handleFileUpload}
                      disabled={!selectedFile || uploading}
                      className="w-full"
                    >
                      {uploading ? 'Uploading...' : 'Upload File'}
                    </Button>
                  </div>
                )}

                {/* Link Upload */}
                {uploadMethod === 'link' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="driveLink">Google Drive Link</Label>
                      <Input
                        id="driveLink"
                        type="url"
                        placeholder="https://drive.google.com/file/d/..."
                        value={driveLink}
                        onChange={(e) => setDriveLink(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <Button
                      onClick={handleLinkUpload}
                      disabled={!driveLink.trim() || uploading}
                      className="w-full"
                    >
                      {uploading ? 'Submitting...' : 'Submit Link'}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submissions List */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Recent Submission</CardTitle>
                <Button variant="link" className="text-primary">View all</Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Filter Tabs */}
              <div className="flex gap-2 mb-6">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                  className="rounded-md"
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'pending' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('pending')}
                  className="rounded-md"
                  size="sm"
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === 'approved' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('approved')}
                  className="rounded-md"
                  size="sm"
                >
                  Approved
                </Button>
                <Button
                  variant={statusFilter === 'declined' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('declined')}
                  className="rounded-md"
                  size="sm"
                >
                  Declined
                </Button>
              </div>

              {/* Table */}
              {getFilteredSubmissions().length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No submissions found</p>
                  <p className="text-sm mt-2">
                    {statusFilter === 'all' 
                      ? 'Upload your first SRS document above'
                      : `No ${statusFilter} submissions`
                    }
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Document</th>
                        <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Submitted</th>
                        <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Score</th>
                        <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredSubmissions().map((submission) => (
                        <tr key={submission.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                {submission.fileType === 'PDF' ? (
                                  <FileText className="h-5 w-5 text-red-500" />
                                ) : submission.fileType === 'DOCX' ? (
                                  <FileText className="h-5 w-5 text-blue-500" />
                                ) : (
                                  <FileText className="h-5 w-5 text-gray-500" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-sm">{submission.fileType}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {submission.fileName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-muted-foreground">
                            {getTimeAgo(submission.createdAt)}
                          </td>
                          <td className="py-4 px-4">
                            <Badge 
                              className={`${getStatusColor(submission.status)} border-0`}
                              variant="secondary"
                            >
                              {formatSubmissionStatus(submission.status)}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-sm font-medium">
                            {getSubmissionScore(submission) !== '-' 
                              ? `${getSubmissionScore(submission)}%` 
                              : '-'
                            }
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>{submission.fileName}</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    {submission.extractedText && (
                                      <div>
                                        <h4 className="font-medium mb-2">Extracted Text</h4>
                                        <Textarea
                                          value={submission.extractedText}
                                          readOnly
                                          className="min-h-[200px]"
                                        />
                                      </div>
                                    )}
                                    {submission.sectionAnalysis && (
                                      <div>
                                        <h4 className="font-medium mb-2">AI Analysis Results</h4>
                                        <div className="bg-gray-100 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap">
                                          {submission.sectionAnalysis}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>

                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => fetchSubmissions()}
                                title="Refresh"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleResubmit(submission)}
                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                title="Resubmit"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(submission.id)}
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resubmit Dialog */}
          <Dialog open={resubmitDialogOpen} onOpenChange={setResubmitDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Resubmit Document
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Version Info */}
                <div className="flex justify-between items-center py-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Version:</p>
                    <p className="font-medium">Version 1</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">New Version:</p>
                    <p className="font-medium text-orange-500">Version 2</p>
                  </div>
                </div>

                {/* Important Notice */}
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <p className="font-semibold mb-2">Important Notice</p>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Your previous submission will be replaced with this new version</li>
                      <li>The previous file will remain in history but the new one will be evaluated</li>
                      <li>Make sure you've addressed all feedback from the previous review</li>
                      <li>The new submission will be re-analyzed by SACE</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                {/* Google Drive Link Input */}
                <div className="space-y-2">
                  <Label htmlFor="resubmit-link" className="flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    Google Drive Link
                  </Label>
                  <Input
                    id="resubmit-link"
                    type="url"
                    placeholder="https://drive.google.com/file/d/..."
                    value={resubmitLink}
                    onChange={(e) => setResubmitLink(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-orange-500">Please enter a Google Drive link</p>
                  <p className="text-xs text-muted-foreground">
                    Paste the shareable link to your SRS document from Google Drive
                  </p>
                </div>

                {/* Replacing Info */}
                {selectedSubmission && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-muted-foreground mb-1">Replacing:</p>
                    <p className="font-medium text-sm">{selectedSubmission.fileName}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setResubmitDialogOpen(false)}
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleResubmitDocument}
                    disabled={uploading || !resubmitLink.trim()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {uploading ? 'Resubmitting...' : 'Resubmit Document'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className="max-w-md">
              <div className="text-center py-6">
                <p className="text-lg font-medium text-red-600 mb-6">
                  Are you sure you want to delete this file?
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={confirmDelete}
                    className="bg-primary hover:bg-primary/90 px-8"
                  >
                    Yes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDeleteDialogOpen(false);
                      setSubmissionToDelete(null);
                    }}
                    className="px-8"
                  >
                    No
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
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

export default SubmissionPage;

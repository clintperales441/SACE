import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Upload, FileText, Link, Trash2, Eye,
  CheckCircle, XCircle, Clock, AlertCircle
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
      const response = await api.get('/submissions');
      setSubmissions(response.data);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
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
    if (!confirm('Are you sure you want to delete this submission?')) {
      return;
    }

    try {
      await api.delete(`/submissions/${id}`);
      setSubmissions(submissions.filter(sub => sub.id !== id));
      showAlert('Submission deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
      showAlert('Failed to delete submission', 'error');
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

  if (loading || loadingSubmissions) {
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

  return (
    <Layout>
      <div className="section-padding min-h-[calc(100vh-200px)]">
        <div className="container-main">
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
                      <Input
                        id="file"
                        type="file"
                        accept=".pdf,.docx"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="mt-1"
                      />
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
            <CardHeader>
              <CardTitle>Your Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No submissions yet</p>
                  <p className="text-sm mt-2">Upload your first SRS document above</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4" />
                            <h3 className="font-medium">{submission.fileName}</h3>
                            <Badge className={getStatusColor(submission.status)}>
                              {getStatusIcon(submission.status)}
                              <span className="ml-1">{submission.status.replace('_', ' ')}</span>
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">Type:</span> {submission.fileType}
                            </div>
                            <div>
                              <span className="font-medium">Size:</span> {submission.fileSize ? `${(submission.fileSize / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Submitted:</span> {new Date(submission.createdAt).toLocaleDateString()}
                            </div>
                          </div>

                          {submission.googleDriveLink && (
                            <div className="mt-2">
                              <a
                                href={submission.googleDriveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                              >
                                View in Google Drive
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
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
                                    <h4 className="font-medium mb-2">Section Analysis</h4>
                                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                                      {JSON.stringify(JSON.parse(submission.sectionAnalysis), null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(submission.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SubmissionPage;

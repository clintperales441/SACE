import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { userAPI } from '@/lib/api';
import {
  User, Mail, Shield, Calendar, Edit2, Save, X,
  Camera, LogOut, Key, ShieldCheck, Trash2
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  const { profile, loading, error, refetch } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [updating, setUpdating] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [deleting, setDeleting] = useState(false);

  // Initialize edit form when profile loads
  useState(() => {
    if (profile) {
      setEditForm({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
      });
    }
  }, [profile]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
    });
    setUpdateError('');
    setUpdateSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdateError('');
    setUpdateSuccess('');
  };

  const handleSave = async () => {
    setUpdating(true);
    setUpdateError('');
    setUpdateSuccess('');

    try {
      await userAPI.updateCurrentUser(editForm);
      setUpdateSuccess('Profile updated successfully!');
      setIsEditing(false);
      refetch();
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleChangePassword = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setShowPasswordDialog(true);
  };

  const handlePasswordSubmit = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setUpdateError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setUpdateError('New password must be at least 6 characters long');
      return;
    }

    setUpdating(true);
    setUpdateError('');
    setUpdateSuccess('');

    try {
      await userAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setUpdateSuccess('Password changed successfully!');
      setShowPasswordDialog(false);
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteSubmit = async () => {
    setDeleting(true);
    try {
      await userAPI.deleteCurrentUser();
      await logout();
      navigate('/login');
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Failed to delete account');
      setShowDeleteDialog(false);
    } finally {
      setDeleting(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="section-padding min-h-[calc(100vh-200px)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="section-padding min-h-[calc(100vh-200px)] flex items-center justify-center">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  const displayProfile = profile || user;

  return (
    <Layout>
      <div className="section-padding min-h-[calc(100vh-200px)]">
        <div className="container-main max-w-4xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                My Profile
              </h1>
              <p className="text-muted-foreground">
                Manage your account information and preferences
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Success/Error Messages */}
          {updateSuccess && (
            <Alert className="mb-6">
              <AlertDescription>{updateSuccess}</AlertDescription>
            </Alert>
          )}

          {updateError && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{updateError}</AlertDescription>
            </Alert>
          )}

          {/* Profile Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                {!isEditing ? (
                  <Button onClick={handleEdit} variant="outline" className="gap-2">
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSave} 
                      disabled={updating}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {updating ? 'Saving...' : 'Save'}
                    </Button>
                    <Button 
                      onClick={handleCancel} 
                      variant="outline"
                      disabled={updating}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center sm:items-start">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage 
                        src={displayProfile?.profileImageUrl} 
                        alt={`${displayProfile?.firstName} ${displayProfile?.lastName}`} 
                      />
                      <AvatarFallback className="text-2xl">
                        {getInitials(displayProfile?.firstName, displayProfile?.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <button 
                        className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary/90"
                        title="Change profile picture"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    {displayProfile?.provider === 'GOOGLE' ? 'Google Account' : 'Local Account'}
                  </p>
                </div>

                {/* Profile Details */}
                <div className="flex-1 space-y-6">
                  {isEditing ? (
                    // Edit Mode
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">First Name</label>
                        <Input
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                          placeholder="First Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name</label>
                        <Input
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                          placeholder="Last Name"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          placeholder="Email"
                          type="email"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium">New Password (optional)</label>
                        <Input
                          value={editForm.password}
                          onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                          placeholder="Leave blank to keep current password"
                          type="password"
                        />
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Full Name</p>
                            <p className="font-medium">
                              {displayProfile?.firstName} {displayProfile?.lastName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{displayProfile?.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Role</p>
                            <p className="font-medium capitalize">
                              {displayProfile?.role?.toLowerCase() || 'User'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Member Since</p>
                            <p className="font-medium">
                              {formatDate(displayProfile?.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Change Password</p>
                  <p className="text-sm text-muted-foreground">
                    Update your password to keep your account secure
                  </p>
                </div>
                <Button onClick={handleChangePassword} variant="outline" className="gap-2">
                  <Key className="h-4 w-4" />
                  Change
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button variant="outline" disabled className="gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Coming Soon
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/50">
                <div>
                  <p className="font-medium text-destructive">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button onClick={handleDeleteAccount} variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new secure password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>
              <Input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="Enter current password"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm New Password</label>
              <Input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePasswordSubmit} disabled={updating}>
              {updating ? 'Updating...' : 'Update Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSubmit} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ProfilePage;

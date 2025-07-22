import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Shield, Save, Eye, EyeOff, AlertTriangle, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfiles";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const ProfileTab = () => {
  const { user } = useAuth();
  const { profile, updateProfile, isLoading } = useProfile();
  const [isSaving, setIsSaving] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    full_name: profile?.full_name || "",
    email: profile?.email || user?.email || "",
    phone: profile?.phone || "",
    department: profile?.department || "",
    instructor_id: profile?.instructor_id || ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Update profile form when profile loads
  React.useEffect(() => {
    if (profile) {
      setProfileForm({
        full_name: profile.full_name || "",
        email: profile.email || user?.email || "",
        phone: profile.phone || "",
        department: profile.department || "",
        instructor_id: profile.instructor_id || ""
      });
    }
  }, [profile, user]);

  const handleProfileUpdate = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await updateProfile({
        full_name: profileForm.full_name,
        phone: profileForm.phone,
        department: profileForm.department,
        instructor_id: profileForm.instructor_id
      });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`
      });
      
      if (error) throw error;
      toast.success("Password reset email sent");
    } catch (error: any) {
      console.error('Error sending password reset:', error);
      toast.error(`Failed to send password reset: ${error.message}`);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      toast.success("Password updated successfully");
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(`Failed to update password: ${error.message}`);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return { strength: 'weak', color: 'red' };
    if (password.length < 10) return { strength: 'medium', color: 'yellow' };
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { strength: 'medium', color: 'yellow' };
    return { strength: 'strong', color: 'green' };
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-surface/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Profile Information</span>
          </CardTitle>
          <CardDescription>Update your personal information and contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profileForm.full_name}
                onChange={(e) => setProfileForm(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                disabled
              />
              <p className="text-xs text-text-secondary">Email cannot be changed from here</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter your phone number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={profileForm.department}
                onChange={(e) => setProfileForm(prev => ({ ...prev, department: e.target.value }))}
                placeholder="Enter your department"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="instructorId">Instructor ID</Label>
              <Input
                id="instructorId"
                value={profileForm.instructor_id}
                onChange={(e) => setProfileForm(prev => ({ ...prev, instructor_id: e.target.value }))}
                placeholder="Enter your instructor ID"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleProfileUpdate} 
            disabled={isSaving || isLoading}
            className="w-full md:w-auto"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Enhanced Password Section */}
      <Card className="border-0 bg-surface/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Password & Security</span>
          </CardTitle>
          <CardDescription>Update your password and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                >
                  {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                >
                  {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {passwordForm.newPassword && (
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full bg-${getPasswordStrength(passwordForm.newPassword).color}-500`}></div>
                  <span className="text-xs text-text-secondary capitalize">
                    {getPasswordStrength(passwordForm.newPassword).strength} password
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                >
                  {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
            </div>

            <div className="flex space-x-2">
              <Button onClick={handlePasswordChange} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
              <Button variant="outline" onClick={handlePasswordReset}>
                <Mail className="w-4 h-4 mr-2" />
                Send Reset Email
              </Button>
            </div>
          </div>

          <Separator />

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Use a strong password with at least 8 characters, including uppercase, lowercase, and numbers.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
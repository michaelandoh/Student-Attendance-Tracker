import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Shield, Clock, Check, AlertTriangle } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const SecurityTab = () => {
  const navigate = useNavigate();
  const { preferences, updatePreferences, formatDate, formatTime } = usePreferences();
  
  // Security settings
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: "1h",
    loginNotifications: true,
    passwordStrength: "medium"
  });

  const [loginHistory] = useState([
    {
      id: 1,
      device: "Chrome on Windows",
      location: "New York, US",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "success"
    },
    {
      id: 2,
      device: "Safari on iPhone",
      location: "New York, US", 
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: "success"
    },
    {
      id: 3,
      device: "Firefox on Mac",
      location: "Unknown",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: "failed"
    }
  ]);

  const handleLogoutAllDevices = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
      toast.success("Logged out from all devices");
      navigate('/auth');
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast.error(`Failed to logout: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-surface/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Security Settings</span>
          </CardTitle>
          <CardDescription>Manage your account security and authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-text-secondary">Add an extra layer of security to your account</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={security.twoFactorEnabled ? "default" : "secondary"}>
                  {security.twoFactorEnabled ? "Enabled" : "Disabled"}
                </Badge>
                <Switch
                  checked={security.twoFactorEnabled}
                  onCheckedChange={(checked) => {
                    setSecurity(prev => ({ ...prev, twoFactorEnabled: checked }));
                    toast.success(checked ? "2FA enabled" : "2FA disabled");
                  }}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Login Notifications</Label>
                <p className="text-sm text-text-secondary">Get notified when someone logs into your account</p>
              </div>
              <Switch
                checked={security.loginNotifications}
                onCheckedChange={(checked) => 
                  setSecurity(prev => ({ ...prev, loginNotifications: checked }))
                }
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Session Timeout</Label>
              <Select value={security.sessionTimeout} onValueChange={(value) => 
                setSecurity(prev => ({ ...prev, sessionTimeout: value }))
              }>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select timeout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15m">15 minutes</SelectItem>
                  <SelectItem value="30m">30 minutes</SelectItem>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="4h">4 hours</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Auto Logout</Label>
              <Select value={preferences.autoLogout} onValueChange={(value: any) => 
                updatePreferences({ autoLogout: value })
              }>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select auto logout time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15m">15 minutes</SelectItem>
                  <SelectItem value="30m">30 minutes</SelectItem>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="4h">4 hours</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-text-secondary">
                Automatically log out after period of inactivity
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <Label>Security Actions</Label>
            <div className="flex flex-col space-y-2">
              <Button 
                variant="outline" 
                onClick={handleLogoutAllDevices}
                className="w-full md:w-auto justify-start"
              >
                <Shield className="w-4 h-4 mr-2" />
                Log out from all devices
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Login Activity */}
      <Card className="border-0 bg-surface/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Recent Login Activity</span>
          </CardTitle>
          <CardDescription>Monitor recent access to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loginHistory.map((login) => (
              <div key={login.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-text-primary">{login.device}</p>
                    <Badge variant={login.status === "success" ? "default" : "destructive"}>
                      {login.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-text-secondary">{login.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-text-primary">{formatDate(login.timestamp)}</p>
                  <p className="text-xs text-text-secondary">{formatTime(login.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Status */}
      <Card className="border-0 bg-surface/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Check className="w-5 h-5" />
            <span>Security Status</span>
          </CardTitle>
          <CardDescription>Your account security overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Check className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Email Verified</p>
                  <p className="text-sm text-green-600">Your email address is confirmed</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">2FA Recommended</p>
                  <p className="text-sm text-yellow-600">Enable for better security</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Active Sessions</p>
                  <p className="text-sm text-blue-600">1 device currently logged in</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Check className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Password Strong</p>
                  <p className="text-sm text-green-600">Last updated recently</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
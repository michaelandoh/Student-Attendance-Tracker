import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";

export const NotificationsTab = () => {
  const { notifications, updateNotifications } = usePreferences();

  return (
    <Card className="border-0 bg-surface/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="w-5 h-5" />
          <span>Notification Preferences</span>
        </CardTitle>
        <CardDescription>Choose how you want to be notified</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-text-secondary">Receive notifications via email</p>
            </div>
            <Switch
              checked={notifications.emailNotifications}
              onCheckedChange={(checked) => 
                updateNotifications({ emailNotifications: checked })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Class Reminders</Label>
              <p className="text-sm text-text-secondary">Get reminded about upcoming classes</p>
            </div>
            <Switch
              checked={notifications.classReminders}
              onCheckedChange={(checked) => 
                updateNotifications({ classReminders: checked })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Attendance Alerts</Label>
              <p className="text-sm text-text-secondary">Alerts for attendance issues</p>
            </div>
            <Switch
              checked={notifications.attendanceAlerts}
              onCheckedChange={(checked) => 
                updateNotifications({ attendanceAlerts: checked })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly Reports</Label>
              <p className="text-sm text-text-secondary">Weekly attendance summary reports</p>
            </div>
            <Switch
              checked={notifications.weeklyReports}
              onCheckedChange={(checked) => 
                updateNotifications({ weeklyReports: checked })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>System Updates</Label>
              <p className="text-sm text-text-secondary">Important system announcements</p>
            </div>
            <Switch
              checked={notifications.systemUpdates}
              onCheckedChange={(checked) => 
                updateNotifications({ systemUpdates: checked })
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
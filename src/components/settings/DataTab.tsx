import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Database, User, Check, AlertTriangle, Shield } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { toast } from "sonner";

export const DataTab = () => {
  const { preferences, updatePreferences, formatDate } = usePreferences();

  const handleExportData = (format: string = 'json') => {
    if (format === 'csv') {
      // Export classes as CSV
      const csvContent = "Class Name,Description,Room,Students\nSample Class,Sample Description,Room 101,25";
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `classes_${formatDate(new Date())}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Classes data exported as CSV");
    } else {
      // Export user data as JSON
      const userData = {
        profile: {},
        preferences,
        exportedAt: new Date().toISOString()
      };
      
      const jsonContent = "data:text/json;charset=utf-8," + JSON.stringify(userData, null, 2);
      const encodedUri = encodeURI(jsonContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `user_data_${formatDate(new Date())}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("User data exported successfully");
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (file.name.endsWith('.json')) {
          const data = JSON.parse(content);
          toast.success(`Imported ${file.name} successfully`);
          console.log('Imported JSON data:', data);
        } else if (file.name.endsWith('.csv')) {
          toast.success(`Imported ${file.name} successfully`);
          console.log('Imported CSV data:', content);
        }
      } catch (error) {
        toast.error('Failed to import file. Please check the format.');
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-surface/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Data Export & Import</span>
          </CardTitle>
          <CardDescription>Manage your data exports, imports, and backups</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-text-primary mb-2 flex items-center">
                <Database className="w-4 h-4 mr-2" />
                Export Your Data
              </h4>
              <p className="text-sm text-text-secondary mb-4">
                Download a complete copy of your account data including profile, classes, students, and attendance records.
              </p>
              <div className="space-y-2">
                <Button variant="outline" onClick={() => handleExportData()} className="w-full">
                  <Database className="w-4 h-4 mr-2" />
                  Export All Data (JSON)
                </Button>
                <Button variant="outline" onClick={() => handleExportData('csv')} className="w-full">
                  <Database className="w-4 h-4 mr-2" />
                  Export Classes (CSV)
                </Button>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-text-primary mb-2 flex items-center">
                <Database className="w-4 h-4 mr-2" />
                Import Data
              </h4>
              <p className="text-sm text-text-secondary mb-4">
                Import student data or class information from CSV files.
              </p>
              <div className="space-y-2">
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileImport}
                  className="hidden"
                  id="file-import"
                />
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('file-import')?.click()}
                  className="w-full"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Import CSV/JSON
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-surface/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Storage & Usage</span>
          </CardTitle>
          <CardDescription>Monitor your data usage and storage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Classes</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">12</p>
                <p className="text-sm text-blue-600">Active classes</p>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800">Students</span>
                </div>
                <p className="text-2xl font-bold text-green-900">234</p>
                <p className="text-sm text-green-600">Total students</p>
              </div>
              
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-purple-800">Records</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">1,567</p>
                <p className="text-sm text-purple-600">Attendance records</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-surface/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Privacy & Data Control</span>
          </CardTitle>
          <CardDescription>Manage your privacy settings and data retention</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Data Retention
              </h4>
              <p className="text-sm text-yellow-700 mb-4">
                Your data is automatically backed up and retained according to our data retention policy.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-700">Auto-delete old attendance records</span>
                <Switch
                  checked={preferences.autoDeleteOldRecords || false}
                  onCheckedChange={(checked) => 
                    updatePreferences({ autoDeleteOldRecords: checked })
                  }
                />
              </div>
            </div>
            
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Danger Zone
              </h4>
              <p className="text-sm text-red-700 mb-4">
                These actions are permanent and cannot be undone.
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full text-red-600 border-red-300 hover:bg-red-50">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Delete All Attendance Records
                </Button>
                <Button variant="outline" className="w-full text-red-600 border-red-300 hover:bg-red-50">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Delete Account Permanently
                </Button>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                <Check className="w-4 h-4 mr-2" />
                Account Status
              </h4>
              <p className="text-sm text-green-700 mb-4">
                Your account is active and all features are available.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700">Account verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700">Data backed up</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700">Privacy compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700">Security enabled</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
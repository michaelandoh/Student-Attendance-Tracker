import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";

export const PreferencesTab = () => {
  const { preferences, updatePreferences, formatDate, formatTime } = usePreferences();

  return (
    <Card className="border-0 bg-surface/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="w-5 h-5" />
          <span>App Preferences</span>
        </CardTitle>
        <CardDescription>Customize your app experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select value={preferences.theme} onValueChange={(value: any) => 
              updatePreferences({ theme: value })
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Language</Label>
            <Select value={preferences.language} onValueChange={(value: any) => 
              updatePreferences({ language: value })
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Date Format</Label>
            <Select value={preferences.dateFormat} onValueChange={(value: any) => 
              updatePreferences({ dateFormat: value })
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select date format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Time Format</Label>
            <Select value={preferences.timeFormat} onValueChange={(value: any) => 
              updatePreferences({ timeFormat: value })
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select time format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12h">12 Hour</SelectItem>
                <SelectItem value="24h">24 Hour</SelectItem>
              </SelectContent>
            </Select>
           </div>
         </div>
         
         <Separator />
         
         {/* Preferences Preview */}
         <div className="p-4 bg-muted/50 rounded-lg">
           <h4 className="font-semibold text-text-primary mb-3">Preview</h4>
           <div className="space-y-2 text-sm">
             <div className="flex justify-between">
               <span className="text-text-secondary">Current Date:</span>
               <span className="text-text-primary">{formatDate(new Date())}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-text-secondary">Current Time:</span>
               <span className="text-text-primary">{formatTime(new Date())}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-text-secondary">Active Theme:</span>
               <Badge variant="secondary" className="capitalize">{preferences.theme}</Badge>
             </div>
             <div className="flex justify-between">
               <span className="text-text-secondary">Language:</span>
               <Badge variant="outline" className="uppercase">{preferences.language}</Badge>
             </div>
           </div>
         </div>
       </CardContent>
     </Card>
   );
};
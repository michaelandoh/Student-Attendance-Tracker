import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Settings as SettingsIcon } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { useAutoLogout } from "@/contexts/PreferencesContext";
import { ProfileTab } from "@/components/settings/ProfileTab";
import { NotificationsTab } from "@/components/settings/NotificationsTab";
import { PreferencesTab } from "@/components/settings/PreferencesTab";
import { SecurityTab } from "@/components/settings/SecurityTab";
import { DataTab } from "@/components/settings/DataTab";

const Settings = () => {
  const navigate = useNavigate();
  
  // Enable auto-logout functionality
  useAutoLogout();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Modern Header */}
          <div className="relative">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-3xl"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"></div>
            
            {/* Header Content */}
            <div className="relative bg-card/40 backdrop-blur-xl border border-border/30 rounded-3xl p-6 lg:p-8 shadow-2xl shadow-primary/10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                
                {/* Left Section */}
                <div className="flex-1">
                  {/* Back Button */}
                  <div className="mb-6">
                    <Button 
                      variant="ghost" 
                      onClick={() => navigate('/dashboard')}
                      className="group px-3 py-2 hover:bg-primary/10 border border-border/30 rounded-xl transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
                      size="sm"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-0.5" />
                      <span className="font-medium">Back to Dashboard</span>
                    </Button>
                  </div>

                  {/* Title */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 border border-primary/20 rounded-2xl">
                        <SettingsIcon className="w-6 h-6 text-primary" />
                      </div>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent leading-tight">
                        Settings
                      </h1>
                    </div>
                    
                    <p className="text-muted-foreground text-base lg:text-lg leading-relaxed max-w-2xl">
                      Manage your account, preferences, and application settings
                    </p>
                  </div>
                </div>
                
                {/* Right Section - Status */}
                <div className="hidden lg:flex flex-col gap-2 text-right">
                  <div className="text-xs text-muted-foreground">Account Status</div>
                  <div className="flex items-center gap-2 justify-end">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <Tabs defaultValue="profile" className="space-y-8">
            
            {/* Modern Tab Navigation */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-2xl"></div>
              <TabsList className="relative w-full h-auto p-2 bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg shadow-primary/5">
                <div className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  <TabsTrigger 
                    value="profile" 
                    className="flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 hover:bg-muted/50"
                  >
                    Profile
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications" 
                    className="flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 hover:bg-muted/50"
                  >
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger 
                    value="preferences" 
                    className="flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 hover:bg-muted/50"
                  >
                    Preferences
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 hover:bg-muted/50 col-span-2 sm:col-span-1"
                  >
                    Security
                  </TabsTrigger>
                  <TabsTrigger 
                    value="data" 
                    className="flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 hover:bg-muted/50 col-span-2 sm:col-span-1 lg:col-span-1"
                  >
                    Data
                  </TabsTrigger>
                </div>
              </TabsList>
            </div>

            {/* Content Sections with Modern Cards */}
            <div className="min-h-[60vh]">
              <TabsContent value="profile" className="mt-0">
                <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/40 p-6 lg:p-8 shadow-xl shadow-primary/5">
                  <ProfileTab />
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="mt-0">
                <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/40 p-6 lg:p-8 shadow-xl shadow-primary/5">
                  <NotificationsTab />
                </div>
              </TabsContent>

              <TabsContent value="preferences" className="mt-0">
                <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/40 p-6 lg:p-8 shadow-xl shadow-primary/5">
                  <PreferencesTab />
                </div>
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/40 p-6 lg:p-8 shadow-xl shadow-primary/5">
                  <SecurityTab />
                </div>
              </TabsContent>

              <TabsContent value="data" className="mt-0">
                <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/40 p-6 lg:p-8 shadow-xl shadow-primary/5">
                  <DataTab />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
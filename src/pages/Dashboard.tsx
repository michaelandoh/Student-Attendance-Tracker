
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Calendar, BarChart3, Settings, QrCode, BookOpen } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import StatsCards from '@/components/StatsCards';
import { useClasses } from '@/hooks/useClasses';
import { useProfile } from '@/hooks/useProfiles';
import { QRCodeDialog } from '@/components/QRCodeDialog';
import { getPersonalizedGreeting } from '@/utils/greeting';

const Dashboard = () => {
  const navigate = useNavigate();
  const { classes, isLoading } = useClasses();
  const { profile } = useProfile();

  // Generate personalized greeting
  const greeting = getPersonalizedGreeting(profile?.full_name);

  const handleCreateClass = () => {
    navigate('/create-class');
  };

  const handleViewClass = (classId: string) => {
    navigate(`/class/${classId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Modern Welcome Section */}
          <div className="relative">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-3xl"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"></div>
            
            {/* Welcome Content */}
            <div className="relative bg-card/40 backdrop-blur-xl border border-border/30 rounded-3xl p-6 lg:p-8 shadow-2xl shadow-primary/10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                
                {/* Left Section */}
                <div className="flex-1">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 border border-primary/20 rounded-2xl">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent leading-tight">
                        {greeting}
                      </h1>
                    </div>
                    
                    <p className="text-muted-foreground text-base lg:text-lg leading-relaxed max-w-2xl">
                      Manage your classes and track attendance with powerful analytics and insights
                    </p>
                  </div>
                </div>
                
                {/* Right Section - Quick Actions */}
                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={handleCreateClass}
                    className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground border-0 rounded-xl px-6 py-3 font-semibold shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                    <Plus className="w-5 h-5 mr-2 relative z-10" />
                    <span className="relative z-10 whitespace-nowrap">Create New Class</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="mb-10">
          <StatsCards />
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <Button 
              onClick={handleCreateClass}
              className="h-20 sm:h-24 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground flex flex-col items-center justify-center space-y-2 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0"
            >
              <Plus className="w-6 h-6 sm:w-7 sm:h-7" />
              <span className="text-sm sm:text-base font-medium">New Class</span>
            </Button>
            <QRCodeDialog>
              <Button 
                variant="outline" 
                className="h-20 sm:h-24 bg-background/50 border-border/40 hover:bg-muted/50 flex flex-col items-center justify-center space-y-2 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <QrCode className="w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground" />
                <span className="text-sm sm:text-base font-medium text-foreground">Generate QR</span>
              </Button>
            </QRCodeDialog>
            <Button 
              variant="outline" 
              className="h-20 sm:h-24 bg-background/50 border-border/40 hover:bg-muted/50 flex flex-col items-center justify-center space-y-2 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/reports')}
            >
              <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground" />
              <span className="text-sm sm:text-base font-medium text-foreground">View Reports</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 sm:h-24 bg-background/50 border-border/40 hover:bg-muted/50 flex flex-col items-center justify-center space-y-2 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground" />
              <span className="text-sm sm:text-base font-medium text-foreground">Settings</span>
            </Button>
          </div>
        </div>

        {/* Classes Overview */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Your Classes</h2>
            <Button 
              onClick={handleCreateClass}
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl px-6 py-3 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Class
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur-sm border border-border/40 rounded-3xl shadow-xl shadow-primary/5 animate-pulse">
                  <CardHeader className="pb-4 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-4 h-4 bg-muted/50 rounded-full"></div>
                      <div className="w-16 h-6 bg-muted/50 rounded-xl"></div>
                    </div>
                    <div className="w-36 h-6 bg-muted/50 rounded-xl mb-3"></div>
                    <div className="w-28 h-4 bg-muted/50 rounded-lg"></div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="space-y-4">
                      <div className="w-32 h-4 bg-muted/50 rounded-lg"></div>
                      <div className="w-28 h-4 bg-muted/50 rounded-lg"></div>
                      <div className="w-full h-10 bg-muted/50 rounded-xl"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.length === 0 ? (
                <div className="col-span-full">
                  <div className="relative">
                    {/* Background Elements */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-3xl"></div>
                    
                    <div className="relative text-center py-20 px-6">
                      <div className="mx-auto w-20 h-20 bg-gradient-to-br from-muted/50 to-muted rounded-3xl flex items-center justify-center mb-6 border border-border/30">
                        <BookOpen className="w-10 h-10 text-muted-foreground" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-foreground mb-3">No classes yet</h3>
                      <p className="text-muted-foreground mb-8 text-base leading-relaxed max-w-md mx-auto">
                        Get started by creating your first class and begin tracking attendance efficiently
                      </p>
                      
                      <Button 
                        onClick={handleCreateClass}
                        className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl px-8 py-4 text-base font-semibold shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 border-0"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Create Your First Class
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                classes.map((classItem) => (
                  <Card 
                    key={classItem.id} 
                    className="group bg-card/50 backdrop-blur-sm border border-border/40 rounded-3xl shadow-xl shadow-primary/5 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:scale-105"
                    onClick={() => handleViewClass(classItem.id)}
                  >
                    <CardHeader className="pb-4 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/30"></div>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs font-semibold px-3 py-1 rounded-xl border border-green-200">
                          Active
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-200">
                        {classItem.name}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground line-clamp-2 leading-relaxed">
                        {classItem.description || 'No description available'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <div className="space-y-4">
                        <div className="flex items-center text-muted-foreground">
                          <div className="p-2 bg-primary/10 rounded-xl border border-primary/20 mr-3">
                            <Calendar className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium">{classItem.schedule || 'Schedule TBD'}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <div className="p-2 bg-primary/10 rounded-xl border border-primary/20 mr-3">
                            <Users className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium">Room: {classItem.room || 'TBD'}</span>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full mt-6 bg-background/50 border-border/40 hover:bg-muted/50 text-foreground font-medium rounded-xl h-11 transition-all duration-200 hover:scale-105"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewClass(classItem.id);
                          }}
                        >
                          Manage Class
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

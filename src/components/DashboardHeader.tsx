
import { Button } from "@/components/ui/button";
import { CheckCircle, User, LogOut } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { NotificationDropdown } from '@/components/NotificationDropdown';

const DashboardHeader = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-surface/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center max-w-7xl">
        <div 
          className="flex items-center space-x-3 cursor-pointer interactive-hover"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 gradient-edu-primary rounded-xl flex items-center justify-center shadow-lg">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ClassSnap
          </h1>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notifications */}
          <NotificationDropdown />
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2 p-2 rounded-xl hover:bg-muted transition-all duration-200">
                <div className="w-8 h-8 gradient-edu-secondary rounded-full flex items-center justify-center shadow-md">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium text-text-primary">
                  {user?.email || 'Instructor'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-surface border border-border rounded-xl shadow-xl">
              <DropdownMenuItem 
                className="flex items-center space-x-3 cursor-pointer px-4 py-3 hover:bg-muted rounded-lg mx-1 my-1 transition-colors duration-200"
                onClick={() => navigate('/settings')}
              >
                <User className="w-4 h-4 text-text-secondary" />
                <span className="text-sm text-text-primary">Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center space-x-3 cursor-pointer px-4 py-3 hover:bg-destructive/10 text-destructive rounded-lg mx-1 my-1 transition-colors duration-200"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

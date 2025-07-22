import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  Users, 
  BarChart3, 
  Bell, 
  Calendar, 
  CheckCircle, 
  X, 
  ArrowRight, 
  ArrowLeft,
  Play,
  Smartphone
} from 'lucide-react';

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const tourSteps = [
  {
    id: 1,
    title: "Welcome to ClassSnap Demo",
    description: "Let's take a quick tour of how ClassSnap makes attendance tracking effortless for educators.",
    icon: Play,
    content: (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">What you'll see in this demo:</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              QR Code attendance system
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Real-time dashboard analytics
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Class management features
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Notification system
            </li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "QR Code Attendance",
    description: "Students simply scan a QR code to mark their attendance - no more paper roll calls!",
    icon: QrCode,
    content: (
      <div className="space-y-4">
        <div className="bg-background border-2 border-dashed border-primary/30 p-8 rounded-xl text-center">
          <div className="w-32 h-32 bg-black mx-auto mb-4 rounded-lg flex items-center justify-center">
            <div className="grid grid-cols-8 gap-1">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-1 ${Math.random() > 0.5 ? 'bg-white' : 'bg-black'}`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Sample QR Code</p>
        </div>
        <div className="flex items-center gap-4 bg-green-50 p-4 rounded-lg">
          <Smartphone className="w-8 h-8 text-green-600" />
          <div>
            <p className="font-medium text-green-900">Instant Scanning</p>
            <p className="text-sm text-green-700">Students use any smartphone camera to scan</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Real-time Dashboard",
    description: "Get instant insights with live attendance data and beautiful analytics.",
    icon: BarChart3,
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">87%</div>
              <div className="text-xs text-muted-foreground">Attendance Rate</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">24</div>
              <div className="text-xs text-muted-foreground">Present Today</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">3</div>
              <div className="text-xs text-muted-foreground">Absent</div>
            </div>
          </Card>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Attendance Trend</span>
            <Badge variant="secondary">Live Data</Badge>
          </div>
          <div className="h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60"></div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Class Management",
    description: "Easily manage multiple classes, students, and schedules from one central dashboard.",
    icon: Users,
    content: (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              CS
            </div>
            <div className="flex-1">
              <p className="font-medium">Computer Science 101</p>
              <p className="text-xs text-muted-foreground">32 students • Room 204</p>
            </div>
            <Badge>Active</Badge>
          </div>
          <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              MA
            </div>
            <div className="flex-1">
              <p className="font-medium">Mathematics 201</p>
              <p className="text-xs text-muted-foreground">28 students • Room 156</p>
            </div>
            <Badge variant="secondary">Scheduled</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          Automatic scheduling and conflict detection
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "Smart Notifications",
    description: "Automated reminders and alerts keep everyone informed about attendance and schedules.",
    icon: Bell,
    content: (
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Class Reminder</p>
              <p className="text-sm text-blue-700">Your CS 101 class starts in 30 minutes</p>
              <p className="text-xs text-blue-600">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
            <Users className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Attendance Alert</p>
              <p className="text-sm text-green-700">High attendance today: 94% present</p>
              <p className="text-xs text-green-600">1 hour ago</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-purple-900">Email Integration</p>
          <p className="text-xs text-purple-700">Automatic weekly reports sent to your inbox</p>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: "Ready to Get Started?",
    description: "Experience the full power of ClassSnap by creating your free account today!",
    icon: CheckCircle,
    content: (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-xl text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Start Your Free Trial</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Join thousands of educators who have transformed their classroom attendance tracking
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Free forever plan
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Setup in 5 minutes
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              24/7 support
            </div>
          </div>
        </div>
      </div>
    )
  }
];

export const GuidedTour: React.FC<GuidedTourProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;

  const nextStep = () => {
    if (!isLastStep) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute right-2 top-2 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
              <step.icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">{step.title}</CardTitle>
              <p className="text-muted-foreground text-sm mt-1">{step.description}</p>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="flex gap-2 mt-4">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary' : 
                  index < currentStep ? 'bg-primary/50' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="min-h-[300px]">
            {step.content}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {tourSteps.length}
            </div>
            
            <div className="flex gap-2">
              {!isFirstStep && (
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}
              
              {!isLastStep ? (
                <Button onClick={nextStep}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleClose}>
                    Close Demo
                  </Button>
                  <Button 
                    onClick={() => {
                      handleClose();
                      window.location.href = '/auth';
                    }}
                    className="bg-gradient-to-r from-primary to-accent"
                  >
                    Start Free Trial
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
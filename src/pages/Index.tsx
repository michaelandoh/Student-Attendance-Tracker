import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  QrCode,
  Users,
  BarChart3,
  Download,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { GuidedTour } from "@/components/GuidedTour";

const Index = () => {
  const [showTour, setShowTour] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const features = [
    {
      icon: QrCode,
      title: "QR Code Attendance",
      description: "Students scan QR codes to mark attendance instantly",
    },
    {
      icon: Users,
      title: "Class Management",
      description: "Organize students and manage multiple classes effortlessly",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Visual attendance trends and downloadable reports",
    },
    {
      icon: Download,
      title: "Export Data",
      description: "Export attendance to PDF or Excel formats",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-secondary overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 gradient-edu-primary rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 gradient-edu-secondary rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 bg-surface/80 backdrop-blur-md border-b border-border/50 sticky top-0">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div
            className="flex items-center space-x-3 cursor-pointer interactive-hover"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 gradient-edu-primary rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ClassSnap
            </h1>
          </div>
          <Button
            onClick={() => navigate("/auth")}
            className="relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-xl interactive-hover"
          >
            <span className="relative z-10">Sign In</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-24 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="animate-fade-in">
            <h2 className="text-6xl md:text-7xl font-bold text-text-primary mb-8 leading-tight">
              Smart Classroom
              <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-pulse">
                Attendance Tracker
              </span>
            </h2>
          </div>
          <div className="animate-fade-in delay-300">
            <p className="text-xl md:text-2xl text-text-secondary mb-12 leading-relaxed max-w-3xl mx-auto">
              Eliminate manual paperwork and streamline attendance tracking with
              QR codes, real-time analytics, and automated reporting. Perfect
              for modern classrooms.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in delay-500">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="relative overflow-hidden gradient-edu-primary text-white px-10 py-4 text-lg rounded-xl interactive-hover shadow-xl"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Tracking Attendance
                <CheckCircle className="w-5 h-5" />
              </span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowTour(true)}
              className="border-2 border-primary/20 bg-surface/50 backdrop-blur-sm hover:bg-primary/10 px-10 py-4 text-lg rounded-xl interactive-hover"
            >
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16 animate-fade-in">
          <h3 className="text-4xl font-bold text-text-primary mb-6">
            Everything You Need for Attendance Management
          </h3>
          <p className="text-text-secondary text-xl max-w-2xl mx-auto">
            Powerful features designed specifically for educators
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden bg-surface/60 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 rounded-2xl animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="absolute inset-0 gradient-edu-accent opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center p-8">
                <div className="w-16 h-16 gradient-edu-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-text-primary group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 px-8 pb-8">
                <CardDescription className="text-text-secondary text-center leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative gradient-edu-primary py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10 container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              {
                icon: Clock,
                title: "Save Time",
                desc: "Reduce attendance taking from minutes to seconds",
              },
              {
                icon: CheckCircle,
                title: "Improve Accuracy",
                desc: "Eliminate human error with digital tracking",
              },
              {
                icon: BarChart3,
                title: "Get Insights",
                desc: "Understand attendance patterns with analytics",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="animate-fade-in hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <benefit.icon className="w-16 h-16 mx-auto mb-6 text-white/90" />
                <h4 className="text-2xl font-semibold mb-4 text-white">
                  {benefit.title}
                </h4>
                <p className="text-white/80 text-lg leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-24 text-center">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <h3 className="text-4xl font-bold text-text-primary mb-6">
            Ready to Transform Your Classroom?
          </h3>
          <p className="text-text-secondary text-xl mb-10 leading-relaxed">
            Join educators who have already simplified their attendance tracking
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="gradient-edu-primary text-white px-12 py-4 text-lg rounded-xl interactive-hover shadow-xl"
          >
            <span className="flex items-center gap-3">
              Get Started Today
              <QrCode className="w-5 h-5" />
            </span>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-text-primary text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 gradient-edu-primary rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold">ClassSnap</span>
          </div>
          <p className="text-white/60 text-lg">
            © 2025 ClassSnap. All rights reserved.
            <br />
            Made with <span className="text-red-400">♥</span> for educators.
          </p>
        </div>
      </footer>

      {/* Guided Tour Modal */}
      <GuidedTour isOpen={showTour} onClose={() => setShowTour(false)} />
    </div>
  );
};

export default Index;

import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-3xl"></div>
      
      <div className="relative text-center py-12 px-6">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-muted/50 to-muted rounded-3xl flex items-center justify-center mb-6 border border-border/30">
          <BookOpen className="w-10 h-10 text-muted-foreground" />
        </div>
        
        <h3 className="text-xl font-bold text-foreground mb-3">No Classes Found</h3>
        <p className="text-muted-foreground mb-8 text-base leading-relaxed max-w-sm mx-auto">
          Create your first class to start generating QR codes for attendance tracking
        </p>
        
        <Button 
          onClick={() => navigate('/create-class')}
          className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl px-8 py-3 font-semibold shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 border-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Your First Class
        </Button>
      </div>
    </div>
  );
};
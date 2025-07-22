import { Button } from "@/components/ui/button";
import { ArrowLeft, QrCode, Users, Calendar, MapPin } from "lucide-react";
import { QRCodeDialog } from "@/components/QRCodeDialog";

interface ClassHeaderProps {
  classData: {
    id: string;
    name: string;
    description?: string | null;
    schedule?: string | null;
    room?: string | null;
  };
  studentCount: number;
  onBack: () => void;
}

export const ClassHeader = ({ classData, studentCount, onBack }: ClassHeaderProps) => {
  return (
    <div className="relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-3xl"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"></div>
      
      {/* Main Content */}
      <div className="relative bg-card/40 backdrop-blur-xl border border-border/30 rounded-3xl p-6 lg:p-8 shadow-2xl shadow-primary/10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-8">
          
          {/* Left Section - Class Information */}
          <div className="flex-1 min-w-0">
            {/* Back Button */}
            <div className="mb-6">
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="group px-3 py-2 hover:bg-primary/10 border border-border/30 rounded-xl transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
                size="sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-0.5" />
                <span className="font-medium">Back to Dashboard</span>
              </Button>
            </div>

            {/* Class Title */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent leading-tight">
                {classData.name}
              </h1>
              
              {classData.description && (
                <p className="text-muted-foreground text-base lg:text-lg leading-relaxed max-w-2xl">
                  {classData.description}
                </p>
              )}

              {/* Class Metadata */}
              <div className="flex flex-wrap gap-4 pt-2">
                {classData.schedule && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-background/50 border border-border/40 rounded-xl">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {classData.schedule}
                    </span>
                  </div>
                )}
                
                {classData.room && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-background/50 border border-border/40 rounded-xl">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {classData.room}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-xl">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">
                    {studentCount} Student{studentCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Section - Actions */}
          <div className="flex flex-col gap-3 lg:items-end">
            <QRCodeDialog classId={classData.id}>
              <Button 
                className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground border-0 rounded-xl px-6 py-3 font-semibold shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                <QrCode className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10 whitespace-nowrap">Generate QR Code</span>
              </Button>
            </QRCodeDialog>
            
            {/* Quick Stats */}
            <div className="hidden lg:flex flex-col gap-2 text-right">
              <div className="text-xs text-muted-foreground">Class Status</div>
              <div className="flex items-center gap-2 justify-end">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
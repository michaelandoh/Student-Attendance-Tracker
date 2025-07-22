import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Smartphone } from 'lucide-react';

interface QRCodeDisplayProps {
  classId: string;
  className: string;
  qrCodeDataUrl: string;
  isGenerating: boolean;
  onDownload: () => void;
  onShare: () => void;
}

export const QRCodeDisplay = ({ 
  classId, 
  className, 
  qrCodeDataUrl, 
  isGenerating, 
  onDownload, 
  onShare 
}: QRCodeDisplayProps) => {
  if (!classId) return null;

  return (
    <div className="relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-3xl"></div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl"></div>
      
      {/* Main Card */}
      <Card className="relative bg-card/50 backdrop-blur-sm border border-border/40 rounded-3xl shadow-xl shadow-primary/5 overflow-hidden">
        <CardHeader className="text-center pb-4 sm:pb-6 space-y-2 sm:space-y-3">
          <CardTitle className="text-lg sm:text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {className}
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium text-sm">
            Attendance QR Code
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center space-y-4 sm:space-y-6 p-4 sm:p-6">
          {/* QR Code Display */}
          <div className="relative">
            {isGenerating ? (
              <div className="w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] bg-gradient-to-br from-muted/50 to-muted rounded-2xl flex items-center justify-center border border-border/30">
                <div className="text-center space-y-3">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/20 border-t-primary mx-auto"></div>
                    <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse"></div>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Generating QR Code...</p>
                </div>
              </div>
            ) : qrCodeDataUrl ? (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                <div className="relative bg-white p-2 sm:p-3 rounded-2xl shadow-lg border border-border/20">
                  <img 
                    src={qrCodeDataUrl} 
                    alt="Attendance QR Code"
                    className="w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] rounded-xl"
                  />
                </div>
              </div>
            ) : null}
          </div>

          {/* Instructions */}
          <div className="text-center space-y-2 sm:space-y-3 max-w-sm px-2">
            <div className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-primary/5 border border-primary/10 rounded-xl">
              <Smartphone className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-foreground">Scan with phone camera</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Students can scan this QR code to quickly mark their attendance for this class
            </p>
          </div>

          {/* Action Buttons */}
          {qrCodeDataUrl && (
            <div className="flex gap-2 sm:gap-3 w-full max-w-sm px-2">
              <Button
                variant="outline"
                onClick={onDownload}
                className="flex-1 h-10 sm:h-11 bg-background/50 border-border/40 hover:bg-muted/50 rounded-xl font-medium transition-all duration-200 hover:scale-105 text-xs sm:text-sm"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Download
              </Button>
              <Button
                onClick={onShare}
                className="flex-1 h-10 sm:h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/25 transition-all duration-200 hover:scale-105 border-0 text-xs sm:text-sm"
              >
                <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Share
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
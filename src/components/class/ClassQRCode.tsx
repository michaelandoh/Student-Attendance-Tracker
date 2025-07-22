import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Download, Share2, Smartphone } from 'lucide-react';
import { useQRCodeGeneration } from '@/components/qr-code/useQRCodeGeneration';
import { Class } from '@/hooks/useClasses';

interface ClassQRCodeProps {
  classData: Class;
}

export const ClassQRCode = ({ classData }: ClassQRCodeProps) => {
  const { 
    qrCodeDataUrl, 
    isGenerating, 
    generateQRCode, 
    downloadQRCode, 
    shareQRCode 
  } = useQRCodeGeneration();

  useEffect(() => {
    if (classData.id) {
      generateQRCode(classData.id);
    }
  }, [classData.id, generateQRCode]);

  const handleDownload = () => downloadQRCode([classData], classData.id);
  const handleShare = () => shareQRCode([classData], classData.id);

  return (
    <Card className="bg-surface border-border">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center space-x-2">
          <QrCode className="w-5 h-5" />
          <span>Attendance QR Code</span>
        </CardTitle>
        <CardDescription>
          Students can scan this QR code to mark their attendance for {classData.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {isGenerating ? (
          <div className="w-[300px] h-[300px] bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-text-muted">Generating QR Code...</p>
            </div>
          </div>
        ) : qrCodeDataUrl ? (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <img 
              src={qrCodeDataUrl} 
              alt="Attendance QR Code"
              className="w-[300px] h-[300px]"
            />
          </div>
        ) : null}

        {/* Instructions */}
        <div className="text-center space-y-2 max-w-sm">
          <div className="flex items-center justify-center space-x-2 text-text-secondary">
            <Smartphone className="w-4 h-4" />
            <span className="text-sm">Students scan with their phone camera</span>
          </div>
          <p className="text-xs text-text-muted">
            The QR code will direct students to the attendance page for this class
          </p>
        </div>

        {/* Action Buttons */}
        {qrCodeDataUrl && (
          <div className="flex space-x-2 w-full max-w-sm">
            <Button
              variant="outline"
              onClick={handleDownload}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={handleShare}
              className="flex-1 bg-gradient-primary hover:bg-gradient-primary/90 text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        )}

        {/* URL Display */}
        {qrCodeDataUrl && (
          <div className="w-full max-w-sm">
            <p className="text-xs text-text-muted mb-2">Attendance URL:</p>
            <div className="bg-surface-secondary p-2 rounded border text-xs font-mono text-text-secondary break-all">
              {`${window.location.origin}/attendance/${classData.id}`}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
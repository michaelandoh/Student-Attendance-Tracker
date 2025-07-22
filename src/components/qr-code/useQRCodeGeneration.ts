import { useState } from 'react';
import QRCode from 'qrcode';
import { toast } from '@/hooks/use-toast';
import { Class } from '@/hooks/useClasses';

export const useQRCodeGeneration = () => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQRCode = async (classId: string) => {
    if (!classId) return;
    
    setIsGenerating(true);
    try {
      const attendanceUrl = `${window.location.origin}/attendance/${classId}`;
      
      const qrDataUrl = await QRCode.toDataURL(attendanceUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1a1a1a',
          light: '#ffffff'
        }
      });
      
      setQrCodeDataUrl(qrDataUrl);
      toast({
        title: "QR Code Generated",
        description: "Students can scan this QR code to mark their attendance",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = (classes: Class[], selectedClassId: string) => {
    if (!qrCodeDataUrl) return;
    
    const selectedClass = classes.find(c => c.id === selectedClassId);
    const fileName = `attendance-qr-${selectedClass?.name || 'class'}.png`;
    
    const link = document.createElement('a');
    link.download = fileName;
    link.href = qrCodeDataUrl;
    link.click();
    
    toast({
      title: "QR Code Downloaded",
      description: `Saved as ${fileName}`,
    });
  };

  const shareQRCode = async (classes: Class[], selectedClassId: string) => {
    if (!qrCodeDataUrl) return;
    
    try {
      const response = await fetch(qrCodeDataUrl);
      const blob = await response.blob();
      
      const selectedClass = classes.find(c => c.id === selectedClassId);
      const fileName = `attendance-qr-${selectedClass?.name || 'class'}.png`;
      
      const file = new File([blob], fileName, { type: 'image/png' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Attendance QR Code',
          text: `QR Code for ${selectedClass?.name || 'Class'} attendance`,
          files: [file]
        });
      } else {
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          toast({
            title: "QR Code Copied",
            description: "QR code copied to clipboard",
          });
        } else {
          downloadQRCode(classes, selectedClassId);
        }
      }
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Could not share QR code. Downloaded instead.",
        variant: "destructive",
      });
      downloadQRCode(classes, selectedClassId);
    }
  };

  return {
    qrCodeDataUrl,
    isGenerating,
    generateQRCode,
    downloadQRCode,
    shareQRCode
  };
};
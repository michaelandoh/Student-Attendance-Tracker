import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QrCode, X, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useClasses } from '@/hooks/useClasses';
import { ClassSelector } from '@/components/qr-code/ClassSelector';
import { QRCodeDisplay } from '@/components/qr-code/QRCodeDisplay';
import { EmptyState } from '@/components/qr-code/EmptyState';
import { useQRCodeGeneration } from '@/components/qr-code/useQRCodeGeneration';

interface QRCodeDialogProps {
  children: React.ReactNode;
  classId?: string;
}

export const QRCodeDialog = ({ children, classId }: QRCodeDialogProps) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(classId || '');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { classes } = useClasses();
  const { 
    qrCodeDataUrl, 
    isGenerating, 
    generateQRCode, 
    downloadQRCode, 
    shareQRCode 
  } = useQRCodeGeneration();

  useEffect(() => {
    if (classId) {
      setSelectedClassId(classId);
    }
  }, [classId]);

  useEffect(() => {
    if (selectedClassId) {
      generateQRCode(selectedClassId);
    }
  }, [selectedClassId]);

  const handleDownload = () => downloadQRCode(classes, selectedClassId);
  const handleShare = () => shareQRCode(classes, selectedClassId);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    setShowScrollTop(target.scrollTop > 100);
  };

  const scrollToTop = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const selectedClass = classes.find(c => c.id === selectedClassId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[420px] border-0 bg-background/95 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
        {/* Close Button */}
        <DialogClose asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute right-4 top-4 rounded-full w-10 h-10 bg-background/90 hover:bg-muted/80 border border-border/20 transition-all duration-300 hover:scale-110 hover:rotate-90 z-20 shadow-lg backdrop-blur-sm"
          >
            <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>

        <ScrollArea 
          ref={scrollAreaRef}
          className="h-[70vh] max-h-[600px]"
          onScrollCapture={handleScroll}
        >
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="mx-auto w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                <QrCode className="w-7 h-7 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground">Generate QR Code</h2>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  Create a QR code for quick attendance tracking
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {!classId && (
                <ClassSelector 
                  classes={classes}
                  selectedClassId={selectedClassId}
                  onClassSelect={setSelectedClassId}
                />
              )}

              {selectedClassId && selectedClass && (
                <QRCodeDisplay
                  classId={selectedClassId}
                  className={selectedClass.name}
                  qrCodeDataUrl={qrCodeDataUrl}
                  isGenerating={isGenerating}
                  onDownload={handleDownload}
                  onShare={handleShare}
                />
              )}

              {!classId && classes.length === 0 && <EmptyState />}
            </div>
          </div>
        </ScrollArea>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <Button
            onClick={scrollToTop}
            size="icon"
            className="absolute bottom-4 right-4 rounded-full w-10 h-10 bg-primary/90 hover:bg-primary shadow-lg transition-all duration-200 hover:scale-105"
          >
            <ChevronUp className="h-4 w-4" />
            <span className="sr-only">Scroll to top</span>
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};
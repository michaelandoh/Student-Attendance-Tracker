import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Class } from '@/hooks/useClasses';

interface ClassSelectorProps {
  classes: Class[];
  selectedClassId: string;
  onClassSelect: (classId: string) => void;
}

export const ClassSelector = ({ classes, selectedClassId, onClassSelect }: ClassSelectorProps) => {
  return (
    <div className="space-y-4">
      <label className="text-sm font-semibold text-foreground flex items-center gap-2">
        <div className="w-1 h-4 bg-primary rounded-full"></div>
        Select Class
      </label>
      <Select value={selectedClassId} onValueChange={onClassSelect}>
        <SelectTrigger className="h-12 bg-background/50 border-border/40 rounded-xl hover:bg-muted/50 transition-all duration-200 focus:ring-2 focus:ring-primary/20">
          <SelectValue 
            placeholder="Choose a class to generate QR code for" 
            className="text-muted-foreground"
          />
        </SelectTrigger>
        <SelectContent className="bg-background/95 backdrop-blur-xl border-border/40 rounded-xl shadow-2xl">
          {classes.map((classItem) => (
            <SelectItem 
              key={classItem.id} 
              value={classItem.id}
              className="hover:bg-muted/50 focus:bg-muted/50 rounded-lg m-1 cursor-pointer transition-all duration-200"
            >
              <div className="flex flex-col items-start py-1">
                <span className="font-semibold text-foreground">{classItem.name}</span>
                {classItem.schedule && (
                  <span className="text-sm text-muted-foreground mt-0.5">{classItem.schedule}</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
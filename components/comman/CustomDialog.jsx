"use client";
import React from "react";
import { FaTimes } from "react-icons/fa";



const CustomDialog = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  maxWidth = "max-w-md"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300">
      {/* Backdrop overlay for closing on click outside */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className={`w-full ${maxWidth} max-h-[90vh] bg-background sanskrit-border flex flex-col shadow-elevated animate-in fade-in zoom-in duration-300 relative z-10`}>
        {/* Header - Fixed at top */}
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-display text-2xl text-primary">{title}</h2>
            <button 
              onClick={onClose}
              className="p-2 -mr-2 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-full transition-all active:scale-90"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
          <div className="ornament-line w-1/4 mb-6" />
        </div>

        {/* Body Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 pt-0 custom-scrollbar">
          <div className="text-foreground">
            {children}
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        {footer && (
          <div className="p-6 pt-4 border-t border-border/50 bg-muted/5">
            <div className="flex gap-3 justify-end">
              {footer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDialog;

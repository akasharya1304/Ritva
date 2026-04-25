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
      
      <div className={`w-full ${maxWidth} bg-background sanskrit-border overflow-hidden shadow-elevated animate-in fade-in zoom-in duration-300 relative z-10`}>
        <div className="relative p-6">
          {/* Header */}
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

          {/* Body Content */}
          <div className="text-foreground">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-border/50">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomDialog;

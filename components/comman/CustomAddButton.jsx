"use client";
import React from "react";
import { FaPlus } from "react-icons/fa";

const CustomAddButton = ({ 
  buttonName = "Add", 
  onClick, 
  className = "", 
  icon = <FaPlus className="w-3 h-3" /> 
}) => {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold shadow hover:scale-105 transition-transform ${className}`}
    >
      {icon} {buttonName}
    </button>
  );
};

export default CustomAddButton;

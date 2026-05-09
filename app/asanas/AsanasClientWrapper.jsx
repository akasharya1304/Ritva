"use client";
import React, { useState } from "react";
import CustomAddButton from "@/components/comman/CustomAddButton";
import YogaPoseForm from "@/components/internal/YogaPoseForm";
import AsanaContentForm from "@/components/internal/AsanaContentForm";
import { FaFileAlt, FaPlus } from "react-icons/fa";

const AsanasClientWrapper = ({asanasView}) => {
  const [activeForm, setActiveForm] = useState(null); // 'pose' or 'content'

  const closeForm = () => setActiveForm(null);

  return (
    <div className="flex gap-4">
      {/* {!asanasView && (<CustomAddButton 
        buttonName="Add Content" 
        onClick={() => setActiveForm('content')} 
        className="bg-accent text-accent-foreground"
        icon={<FaFileAlt className="w-3 h-3" />}
      />)} */}

      {/* {asanasView && (<CustomAddButton 
        buttonName="Add Pose" 
        onClick={() => setActiveForm('pose')} 
        icon={<FaPlus className="w-3 h-3" />}
      />)} */}

      {activeForm === 'pose' && (
        <div className="fixed inset-0 z-50 bg-background overflow-y-auto p-4 md:p-8 animate-in fade-in zoom-in duration-300">
          <YogaPoseForm 
            onClose={closeForm} 
            onSuccess={closeForm} 
          />
        </div>
      )}

      {activeForm === 'content' && (
        <div className="fixed inset-0 z-50 bg-background overflow-y-auto p-4 md:p-8 animate-in fade-in zoom-in duration-300">
          <AsanaContentForm 
            onClose={closeForm} 
            onSuccess={closeForm} 
          />
        </div>
      )}
    </div>
  );
};

export default AsanasClientWrapper;

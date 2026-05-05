"use client";
import React, { useState } from "react";
import CustomAddButton from "@/components/comman/CustomAddButton";
import YogaPoseForm from "@/components/internal/YogaPoseForm";

const AsanasClientWrapper = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      {/* <CustomAddButton 
        buttonName="Add Pose" 
        onClick={() => setShowForm(true)} 
      /> */}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-background overflow-y-auto p-4 md:p-8 animate-in fade-in zoom-in duration-300">
          <YogaPoseForm 
            onClose={() => setShowForm(false)} 
            onSuccess={() => setShowForm(false)} 
          />
        </div>
      )}
    </>
  );
};

export default AsanasClientWrapper;

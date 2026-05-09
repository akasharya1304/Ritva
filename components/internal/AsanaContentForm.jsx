"use client";
import React, { useState } from "react";
import { FaPlus, FaTrash, FaSave, FaHeading, FaParagraph } from "react-icons/fa";

const AsanaContentForm = ({ initialData = null, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState(initialData || {
    title: "",
    summary: "",
    details: [
      { heading: "", description: "" }
    ]
  });

  const addDetail = () => {
    setFormData({
      ...formData,
      details: [...formData.details, { heading: "", description: "" }]
    });
  };

  const updateDetail = (index, field, value) => {
    const newDetails = [...formData.details];
    newDetails[index][field] = value;
    setFormData({
      ...formData,
      details: newDetails
    });
  };

  const removeDetail = (index) => {
    const newDetails = [...formData.details];
    newDetails.splice(index, 1);
    setFormData({
      ...formData,
      details: newDetails
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const isUpdating = !!initialData?.id;
      const url = isUpdating ? `/api/asana-content/${initialData.id}` : '/api/asana-content';
      const method = isUpdating ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert(isUpdating ? "Content updated successfully!" : "Content saved successfully!");
        if (onSuccess) onSuccess();
      } else {
        const err = await response.json();
        alert("Failed to save: " + (err.error || "Unknown Error"));
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="font-display text-3xl text-primary">{initialData ? 'Edit Asana Content' : 'Add Asana Content'}</h1>
        <p className="text-sm text-muted-foreground font-serif">Create and manage descriptive content for asanas.</p>
      </div>

      <div className="ornament-line w-full" />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-card border border-border shadow-soft rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-display text-primary mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">1</span>
            Basic Information
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-display text-primary/70 mb-1 block">Title</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Benefits of Surya Namaskar"
                className="w-full bg-muted/30 border border-border rounded-lg px-4 py-3 text-sm font-serif outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-display text-primary/70 mb-1 block">Summary</label>
              <textarea 
                required
                value={formData.summary}
                onChange={(e) => setFormData({...formData, summary: e.target.value})}
                placeholder="Brief summary of the content..."
                rows="3"
                className="w-full bg-muted/30 border border-border rounded-lg px-4 py-3 text-sm font-serif outline-none focus:border-primary transition-colors resize-y"
              />
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-card border border-border shadow-soft rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display text-primary flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">2</span>
              Details & Sections
            </h2>
            <button 
              type="button" 
              onClick={addDetail}
              className="flex items-center gap-2 text-primary text-sm font-bold hover:underline"
            >
              <FaPlus className="w-3 h-3" /> Add Section
            </button>
          </div>

          <div className="space-y-6">
            {formData.details.map((detail, index) => (
              <div key={index} className="p-6 bg-muted/10 border border-border rounded-xl space-y-4 relative group">
                <button 
                  type="button" 
                  onClick={() => removeDetail(index)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                >
                  <FaTrash className="w-4 h-4" />
                </button>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-display text-primary/70 mb-1 block flex items-center gap-2">
                    <FaHeading className="w-3 h-3" /> Heading
                  </label>
                  <input 
                    type="text" 
                    required
                    value={detail.heading}
                    onChange={(e) => updateDetail(index, 'heading', e.target.value)}
                    placeholder="Section heading..."
                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm font-serif outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-display text-primary/70 mb-1 block flex items-center gap-2">
                    <FaParagraph className="w-3 h-3" /> Description
                  </label>
                  <textarea 
                    required
                    value={detail.description}
                    onChange={(e) => updateDetail(index, 'description', e.target.value)}
                    placeholder="Detailed description..."
                    rows="4"
                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm font-serif outline-none focus:border-primary transition-colors resize-y"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end gap-4 sticky bottom-6 bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-border shadow-elevated z-10">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
              isSubmitting ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground shadow-lg hover:scale-105 active:scale-95'
            }`}
          >
            <FaSave className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : 'Save Content'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AsanaContentForm;

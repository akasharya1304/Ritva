"use client";
import React, { useState } from "react";
import { FaPlus, FaTrash, FaImage, FaSave, FaAlignLeft, FaListOl, FaInfoCircle } from "react-icons/fa";

const YogaPoseForm = ({ initialData = null, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState(initialData || {
    category: "Asana",
    asanaName: "",
    group: "Pawanmuktasana Part 1- ANTI-RHEUMATIC GROUP",
    type: "Beginner",
    details: {
      pic: [],
      steps: [""],
      stage: [],
      breathing: "",
      awareness: "",
      benefits: "",
      contraindications: "",
      practiceNote: "",
      variation: "",
      sequence: "",
      duration: ""
    }
  });

  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleImageChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
      
      const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index, isExisting) => {
    if (isExisting) {
      const newPic = [...formData.details.pic];
      newPic.splice(index, 1);
      setFormData({
        ...formData,
        details: { ...formData.details, pic: newPic }
      });
    } else {
      const newFiles = [...files];
      newFiles.splice(index, 1);
      setFiles(newFiles);

      const newPreviewUrls = [...previewUrls];
      URL.revokeObjectURL(newPreviewUrls[index]);
      newPreviewUrls.splice(index, 1);
      setPreviewUrls(newPreviewUrls);
    }
  };

  const addStep = () => {
    setFormData({
      ...formData,
      details: {
        ...formData.details,
        steps: [...formData.details.steps, ""]
      }
    });
  };

  const updateStep = (index, value) => {
    const newSteps = [...formData.details.steps];
    newSteps[index] = value;
    setFormData({
      ...formData,
      details: { ...formData.details, steps: newSteps }
    });
  };

  const removeStep = (index) => {
    const newSteps = [...formData.details.steps];
    newSteps.splice(index, 1);
    setFormData({
      ...formData,
      details: { ...formData.details, steps: newSteps }
    });
  };

  const addStage = () => {
    const nextIndex = formData.details.stage.length > 0 
      ? Math.max(...formData.details.stage.map(s => s.index)) + 1 
      : 1;
    setFormData({
      ...formData,
      details: {
        ...formData.details,
        stage: [...formData.details.stage, { index: nextIndex, description: "" }]
      }
    });
  };

  const updateStage = (index, field, value) => {
    const newStage = [...formData.details.stage];
    newStage[index][field] = value;
    setFormData({
      ...formData,
      details: { ...formData.details, stage: newStage }
    });
  };

  const removeStage = (index) => {
    const newStage = [...formData.details.stage];
    newStage.splice(index, 1);
    setFormData({
      ...formData,
      details: { ...formData.details, stage: newStage }
    });
  };

  const handleDetailChange = (field, value) => {
    setFormData({
      ...formData,
      details: {
        ...formData.details,
        [field]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const isUpdating = !!initialData?.id;
      const url = isUpdating ? `/api/asanas/${initialData.id}` : '/api/asanas';
      const method = isUpdating ? 'PUT' : 'POST';

      const formDataToSend = new FormData();
      formDataToSend.append('category', formData.category);
      formDataToSend.append('asanaName', formData.asanaName);
      formDataToSend.append('group', formData.group);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('details', JSON.stringify(formData.details));

      files.forEach(file => {
        formDataToSend.append('pic', file);
      });

      const response = await fetch(url, {
        method,
        body: formDataToSend
      });
      
      if (response.ok) {
        alert(isUpdating ? "Pose updated successfully!" : "Pose saved successfully!");
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
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="font-display text-3xl text-primary">{initialData ? 'Edit Yoga Pose' : 'Add Yoga Pose'}</h1>
        <p className="text-sm text-muted-foreground font-serif">Create and manage asana records and postures.</p>
      </div>

      <div className="ornament-line w-full" />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header Section */}
        <div className="bg-card border border-border shadow-soft rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-display text-primary mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">1</span>
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-display text-primary/70 mb-1 block">Category</label>
              <select 
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-muted/30 border border-border rounded-lg px-4 py-3 text-sm font-serif outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
              >
                <option value="Asana">Asana</option>
                <option value="Pranayama">Pranayama</option>
                <option value="Mudra">Mudra</option>
                <option value="Bandha">Bandha</option>
                <option value="Shatkanna">Shatkanna</option>
              </select>
            </div>
            
            <div>
              <label className="text-[10px] uppercase tracking-widest font-display text-primary/70 mb-1 block">Type</label>
              <select 
                required
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full bg-muted/30 border border-border rounded-lg px-4 py-3 text-sm font-serif outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest font-display text-primary/70 mb-1 block">Asana Name</label>
              <input 
                type="text" 
                required
                value={formData.asanaName}
                onChange={(e) => setFormData({...formData, asanaName: e.target.value})}
                placeholder="e.g. Padanguli Naman (toe bending)"
                className="w-full bg-muted/30 border border-border rounded-lg px-4 py-3 text-sm font-serif outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest font-display text-primary/70 mb-1 block">Group Name</label>
              <input 
                type="text" 
                required
                value={formData.group}
                onChange={(e) => setFormData({...formData, group: e.target.value})}
                placeholder="e.g. Pawanmuktasana Part 1- ANTI-RHEUMATIC GROUP"
                className="w-full bg-muted/30 border border-border rounded-lg px-4 py-3 text-sm font-serif outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Media & Steps */}
        <div className="bg-card border border-border shadow-soft rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-display text-primary mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">2</span>
            Media & Instructions
          </h2>

          <div className="space-y-8">
            {/* Images */}
            <div>
              <label className="text-[10px] uppercase tracking-widest font-display text-primary/70 mb-2 block flex items-center gap-2">
                <FaImage /> Upload Images
              </label>
              <div className="flex flex-wrap gap-4 mb-4">
                {formData.details.pic.map((url, i) => (
                  <div key={`existing-${i}`} className="relative w-24 h-24 rounded-lg border border-border overflow-hidden">
                    <img src={url} alt="pose" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(i, true)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded">
                      <FaTrash className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {previewUrls.map((url, i) => (
                  <div key={`new-${i}`} className="relative w-24 h-24 rounded-lg border border-border overflow-hidden">
                    <img src={url} alt="pose preview" className="w-full h-full object-cover opacity-70" />
                    <button type="button" onClick={() => removeImage(i, false)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded">
                      <FaTrash className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <input 
                type="file" 
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full bg-muted/30 border border-border rounded-lg px-4 py-3 text-sm font-serif outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Steps */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-[10px] uppercase tracking-widest font-display text-primary/70 block flex items-center gap-2">
                  <FaListOl /> Steps
                </label>
                <button type="button" onClick={addStep} className="flex items-center gap-2 text-primary text-sm font-bold hover:underline">
                  <FaPlus className="w-3 h-3" /> Add Step
                </button>
              </div>
              <div className="space-y-3">
                {formData.details.steps.map((step, index) => (
                  <div key={`step-${index}`} className="flex gap-3 items-start">
                    <span className="w-8 h-8 flex-shrink-0 bg-muted rounded-full flex items-center justify-center text-sm font-display text-muted-foreground">
                      {index + 1}
                    </span>
                    <textarea 
                      value={step}
                      required
                      onChange={(e) => updateStep(index, e.target.value)}
                      placeholder={`Step ${index + 1} description...`}
                      className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-sm font-serif outline-none focus:border-primary transition-colors resize-y"
                    />
                    <button 
                      type="button" 
                      onClick={() => removeStep(index)}
                      className="mt-2 text-muted-foreground hover:text-destructive transition-colors p-2 rounded-lg hover:bg-destructive/10"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="bg-card border border-border shadow-soft rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-display text-primary mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">3</span>
            Additional Details (Optional)
          </h2>

          <div className="space-y-6">
            
            {/* Stages */}
            <div className="border border-border/50 rounded-xl p-5 bg-muted/10">
              <div className="flex items-center justify-between mb-4">
                <label className="text-[10px] uppercase tracking-widest font-display text-primary/70 block">Stages</label>
                <button type="button" onClick={addStage} className="flex items-center gap-2 text-primary text-sm font-bold hover:underline">
                  <FaPlus className="w-3 h-3" /> Add Stage
                </button>
              </div>
              <div className="space-y-3">
                {formData.details.stage.map((stage, index) => (
                  <div key={`stage-${index}`} className="flex gap-3 items-start">
                    <input 
                      type="number"
                      value={stage.index}
                      onChange={(e) => updateStage(index, 'index', parseInt(e.target.value) || 0)}
                      className="w-16 bg-background border border-border rounded-lg px-2 py-3 text-sm text-center outline-none focus:border-primary"
                    />
                    <textarea 
                      value={stage.description}
                      onChange={(e) => updateStage(index, 'description', e.target.value)}
                      placeholder={`Stage description...`}
                      rows="3"
                      className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-sm font-serif outline-none focus:border-primary transition-colors resize-y"
                    />
                    <button 
                      type="button" 
                      onClick={() => removeStage(index)}
                      className="mt-2 text-muted-foreground hover:text-destructive transition-colors p-2 rounded-lg hover:bg-destructive/10"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {formData.details.stage.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No stages added.</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Breathing", key: "breathing" },
                { label: "Awareness", key: "awareness" },
                { label: "Benefits", key: "benefits" },
                { label: "Contra-indications", key: "contraindications" },
                { label: "Practice Note", key: "practiceNote" },
                { label: "Variation", key: "variation" },
                { label: "Sequence", key: "sequence" },
                { label: "Duration", key: "duration" },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-[10px] uppercase tracking-widest font-display text-primary/70 mb-1 block">
                    {field.label}
                  </label>
                  <textarea 
                    value={formData.details[field.key] || ""}
                    onChange={(e) => handleDetailChange(field.key, e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()} details...`}
                    rows="3"
                    className="w-full bg-muted/30 border border-border rounded-lg px-4 py-3 text-sm font-serif outline-none focus:border-primary transition-colors resize-y"
                  />
                </div>
              ))}
            </div>

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
            {isSubmitting ? 'Saving...' : 'Save Pose'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default YogaPoseForm;

"use client";
import React, { useState } from "react";
import { FaPlus, FaTrash, FaImage, FaQuoteLeft, FaHeading, FaAlignLeft, FaSave, FaMagic } from "react-icons/fa";

const YogaContentForm = ({ initialData = null, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState(initialData || {
    title_en: "",
    title_hi: "",
    slug: "",
    category: "Philosophy",
    thumbnailUrl: "",
    order: 1,
    sections: []
  });

  const generateSlug = () => {
    if (!formData.title_en) return;
    const slug = formData.title_en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormData({ ...formData, slug });
  };

  const addBlock = () => {
    setFormData({
      ...formData,
      sections: [
        ...formData.sections,
        {
          id: Date.now(), // temporary id for React key
          type: "paragraph", // default type
          content_en: "",
          content_hi: "",
          author: "",
          imageUrl: ""
        }
      ]
    });
  };

  const removeBlock = (index) => {
    const newSections = [...formData.sections];
    newSections.splice(index, 1);
    setFormData({ ...formData, sections: newSections });
  };

  const updateBlock = (index, field, value) => {
    const newSections = [...formData.sections];
    newSections[index][field] = value;
    setFormData({ ...formData, sections: newSections });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, this connects to /api/content
      console.log("Submitting:", formData);
      const payload = {
        ...formData,
        estimatedReadTime: Math.ceil((formData.sections.reduce((acc, sec) => acc + sec.content_en.length, 0)) / 1000) || 5, // mock read time
        // Clean up temporary IDs
        sections: formData.sections.map(({ id, ...rest }) => rest)
      };
      
      // Determine if we are updating or creating
      const isUpdating = !!initialData?.id;
      const url = isUpdating ? `/api/content/${initialData.id}` : '/api/content';
      const method = isUpdating ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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

  const getIconForType = (type) => {
    switch(type) {
      case 'heading': return <FaHeading className="w-4 h-4 text-primary" />;
      case 'quote': return <FaQuoteLeft className="w-4 h-4 text-primary" />;
      case 'image': return <FaImage className="w-4 h-4 text-primary" />;
      default: return <FaAlignLeft className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="font-display text-3xl text-primary">Yoga Content Management</h1>
        <p className="text-sm text-muted-foreground font-serif">Create and manage structured learning modules.</p>
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
            <div className="md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest font-display text-primary/70 mb-1 block">English Title</label>
              <input 
                type="text" 
                required
                value={formData.title_en}
                onChange={(e) => setFormData({...formData, title_en: e.target.value})}
                placeholder="e.g. Introduction to Ashtanga Yoga"
                className="w-full bg-muted/30 border border-border rounded-lg px-4 py-3 text-sm font-serif outline-none focus:border-primary transition-colors"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest font-display text-primary/70 mb-1 block">Hindi Title</label>
              <input 
                type="text" 
                value={formData.title_hi}
                onChange={(e) => setFormData({...formData, title_hi: e.target.value})}
                placeholder="e.g. अष्टांग योग का परिचय"
                className="w-full bg-muted/30 border border-border rounded-lg px-4 py-3 text-sm font-serif outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="md:col-span-2 flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-[10px] uppercase tracking-widest font-display text-primary/70 mb-1 block">URL Slug</label>
                <input 
                  type="text" 
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  placeholder="e.g. intro-to-ashtanga"
                  className="w-full bg-muted/30 border border-border rounded-lg px-4 py-3 text-sm font-serif outline-none focus:border-primary transition-colors"
                />
              </div>
              <button 
                type="button"
                onClick={generateSlug}
                className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-3 rounded-lg font-bold hover:bg-primary/20 transition-all whitespace-nowrap"
              >
                <FaMagic className="w-4 h-4" />
                Generate
              </button>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-display text-primary/70 mb-1 block">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-muted/30 border border-border rounded-lg px-4 py-3 text-sm font-serif outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
              >
                <option value="Philosophy">Philosophy</option>
                <option value="History">History</option>
                <option value="Basics">Basics</option>
                <option value="Techniques">Techniques</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-display text-primary/70 mb-1 block">Order / Chapter Number</label>
              <input 
                type="number" 
                min="1"
                required
                value={formData.order}
                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 1})}
                className="w-full bg-muted/30 border border-border rounded-lg px-4 py-3 text-sm font-serif outline-none focus:border-primary transition-colors"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest font-display text-primary/70 mb-1 block">Thumbnail Image URL</label>
              <div className="flex gap-4 items-center">
                <input 
                  type="text" 
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({...formData, thumbnailUrl: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 bg-muted/30 border border-border rounded-lg px-4 py-3 text-sm font-serif outline-none focus:border-primary transition-colors"
                />
                {formData.thumbnailUrl && (
                  <div className="w-12 h-12 rounded-lg border border-border overflow-hidden flex-shrink-0">
                    <img src={formData.thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modular Content Blocks Section */}
        <div className="bg-card border border-border shadow-soft rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display text-primary flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">2</span>
              Content Blocks
            </h2>
            <button 
              type="button"
              onClick={addBlock}
              className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <FaPlus className="w-3 h-3" />
              Add Block
            </button>
          </div>

          <div className="space-y-6">
            {formData.sections.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                <FaAlignLeft className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground font-serif">No content blocks yet. Add a block to start building this module.</p>
              </div>
            ) : (
              formData.sections.map((block, index) => (
                <div key={block.id} className="relative border border-border bg-muted/10 rounded-xl p-5 hover:border-primary/50 transition-colors group">
                  
                  {/* Block Header / Type Selector */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center shadow-sm">
                        {getIconForType(block.type)}
                      </div>
                      <select 
                        value={block.type}
                        onChange={(e) => updateBlock(index, 'type', e.target.value)}
                        className="bg-transparent font-display text-sm font-bold text-foreground outline-none cursor-pointer appearance-none"
                      >
                        <option value="paragraph">Paragraph</option>
                        <option value="heading">Heading</option>
                        <option value="quote">Quote</option>
                        <option value="image">Image</option>
                      </select>
                    </div>
                    
                    <button 
                      type="button"
                      onClick={() => removeBlock(index)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-2 rounded-lg hover:bg-destructive/10 opacity-50 group-hover:opacity-100"
                      title="Remove Block"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Block Content Inputs */}
                  <div className="space-y-4">
                    {/* Specific Fields per Type */}
                    {block.type === 'quote' && (
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-display text-primary/70 mb-1 block">Author</label>
                        <input 
                          type="text" 
                          value={block.author}
                          onChange={(e) => updateBlock(index, 'author', e.target.value)}
                          placeholder="e.g. Patanjali"
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    )}
                    
                    {block.type === 'image' && (
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-display text-primary/70 mb-1 block">Image URL</label>
                        <div className="flex gap-3">
                          <input 
                            type="text" 
                            value={block.imageUrl}
                            onChange={(e) => updateBlock(index, 'imageUrl', e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                          />
                          {block.imageUrl && (
                            <img src={block.imageUrl} alt="Preview" className="w-10 h-10 rounded border border-border object-cover" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Common Content Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-display text-primary/70 mb-1 block">
                          {block.type === 'image' ? 'English Caption' : 'English Content'}
                        </label>
                        <textarea 
                          required={block.type !== 'image'}
                          value={block.content_en}
                          onChange={(e) => updateBlock(index, 'content_en', e.target.value)}
                          rows={block.type === 'heading' || block.type === 'image' ? 2 : 4}
                          placeholder={`Enter English ${block.type === 'image' ? 'caption' : 'text'}...`}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-serif outline-none focus:border-primary transition-colors resize-y"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-display text-primary/70 mb-1 block">
                          {block.type === 'image' ? 'Hindi Caption' : 'Hindi Content'}
                        </label>
                        <textarea 
                          value={block.content_hi}
                          onChange={(e) => updateBlock(index, 'content_hi', e.target.value)}
                          rows={block.type === 'heading' || block.type === 'image' ? 2 : 4}
                          placeholder={`Enter Hindi ${block.type === 'image' ? 'caption' : 'text'}...`}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-serif outline-none focus:border-primary transition-colors resize-y"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
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

export default YogaContentForm;

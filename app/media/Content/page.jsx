"use client";
import React, { useState, useEffect } from "react";
import YogaContentForm from "@/components/internal/YogaContentForm";
import { FaPlus, FaEdit, FaEye, FaBook } from "react-icons/fa";
import { useRouter } from "next/navigation";

const ContentPage = () => {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [contentList, setContentList] = useState([]);
  const [editingContent, setEditingContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/content');
      const data = await response.json();
      if (Array.isArray(data)) {
        setContentList(data);
      }
    } catch (error) {
      console.error("Failed to fetch content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleAddNew = () => {
    setEditingContent(null);
    setIsFormOpen(true);
  };

  const handleEdit = (e, content) => {
    e.stopPropagation();
    setEditingContent(content);
    setIsFormOpen(true);
  };

  const handleViewDetails = (slug) => {
    router.push(`/media/Content/${slug}`);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingContent(null);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingContent(null);
    fetchContent();
  };

  if (isFormOpen) {
    return (
      <div className="w-full">
        <YogaContentForm 
          initialData={editingContent} 
          onClose={handleFormClose} 
          onSuccess={handleFormSuccess} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-primary">Yoga Content</h1>
          <p className="text-sm text-muted-foreground font-serif">Manage learning modules and chapters.</p>
        </div>
        
        {/* <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-soft hover:shadow-elevated transition-all active:scale-95"
        >
          <FaPlus className="w-4 h-4" />
          Add New Module
        </button> */}
      </div>

      <div className="ornament-line w-full" />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : contentList.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
          <FaBook className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground font-serif">No content modules found. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentList.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleViewDetails(item.slug)}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all cursor-pointer group flex flex-col h-full"
            >
              {/* Thumbnail Area */}
              <div className="h-40 bg-muted/50 relative overflow-hidden flex-shrink-0">
                {item.thumbnailUrl ? (
                  <img src={item.thumbnailUrl} alt={item.title_en} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaBook className="text-4xl text-muted-foreground/20" />
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-background/90 backdrop-blur text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                  {item.category}
                </div>
              </div>
              
              {/* Content Area */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-2">
                  <p className="text-xs text-muted-foreground font-medium mb-1">Chapter {item.order}</p>
                  <h3 className="font-display text-lg text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">{item.title_en}</h3>
                  {item.title_hi && <p className="font-serif text-sm text-muted-foreground mt-1 line-clamp-1">{item.title_hi}</p>}
                </div>
                
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
                  <span className="text-xs text-muted-foreground font-medium bg-muted px-2.5 py-1 rounded-md">
                    {item.sections?.length || 0} Blocks
                  </span>
                  
                  <div className="flex gap-2">
                    {/* <button 
                      onClick={(e) => handleEdit(e, item)}
                      className="p-2 text-muted-foreground hover:text-saffron hover:bg-saffron/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FaEdit />
                    </button> */}
                    <button 
                      onClick={() => handleViewDetails(item.slug)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentPage;

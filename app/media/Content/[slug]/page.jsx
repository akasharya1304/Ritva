"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaClock, FaBookOpen, FaQuoteLeft } from "react-icons/fa";

const ContentDetailView = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(`/api/content/slug/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setContent(data);
        } else {
          router.push('/media/Content');
        }
      } catch (error) {
        console.error("Failed to fetch content details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) fetchDetail();
  }, [slug, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-8 animate-fade-in">
      {/* Navigation */}
      <button 
        onClick={() => router.push('/media/Content')}
        className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        Back to Library
      </button>

      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden shadow-elevated bg-card border border-border">
        {content.thumbnailUrl && (
          <div className="w-full h-64 md:h-80 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
            <img 
              src={content.thumbnailUrl} 
              alt={content.title_en}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className={`relative z-20 px-8 pb-8 ${content.thumbnailUrl ? '-mt-32' : 'pt-12'}`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-primary/20">
              {content.category}
            </span>
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <FaBookOpen className="text-primary/70" /> Chapter {content.order}
            </span>
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <FaClock className="text-primary/70" /> {content.estimatedReadTime} min read
            </span>
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight mb-2">
            {content.title_en}
          </h1>
          {content.title_hi && (
            <h2 className="font-serif text-2xl text-muted-foreground">
              {content.title_hi}
            </h2>
          )}
        </div>
      </div>

      <div className="ornament-line w-full opacity-50" />

      {/* Content Blocks */}
      <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-soft space-y-12">
        {content.sections && content.sections.map((block, idx) => (
          <div key={idx} className="content-block">
            {block.type === 'heading' && (
              <div className="mb-6">
                <h3 className="font-display text-2xl text-primary">{block.content_en}</h3>
                {block.content_hi && <h4 className="font-serif text-xl text-muted-foreground mt-1">{block.content_hi}</h4>}
              </div>
            )}
            
            {block.type === 'paragraph' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg leading-relaxed">
                <p className="font-serif text-foreground/90 whitespace-pre-wrap">{block.content_en}</p>
                {block.content_hi && <p className="font-serif text-muted-foreground whitespace-pre-wrap">{block.content_hi}</p>}
              </div>
            )}

            {block.type === 'quote' && (
              <blockquote className="relative my-8 p-8 bg-muted/30 border-l-4 border-saffron rounded-r-2xl">
                <FaQuoteLeft className="absolute top-4 left-4 text-4xl text-saffron/10" />
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 text-xl font-display italic text-foreground/80">
                  <p>{block.content_en}</p>
                  {block.content_hi && <p className="text-muted-foreground">{block.content_hi}</p>}
                </div>
                {block.author && (
                  <footer className="relative z-10 mt-4 text-sm font-bold text-saffron-dark tracking-wider uppercase">
                    — {block.author}
                  </footer>
                )}
              </blockquote>
            )}

            {block.type === 'image' && block.imageUrl && (
              <figure className="my-10">
                <div className="rounded-2xl overflow-hidden border border-border shadow-md">
                  <img src={block.imageUrl} alt={block.caption_en || "Content image"} className="w-full object-cover max-h-[600px]" />
                </div>
                {(block.caption_en || block.caption_hi) && (
                  <figcaption className="mt-4 text-center">
                    {block.caption_en && <p className="text-sm font-medium text-foreground">{block.caption_en}</p>}
                    {block.caption_hi && <p className="text-sm font-serif text-muted-foreground mt-1">{block.caption_hi}</p>}
                  </figcaption>
                )}
              </figure>
            )}
          </div>
        ))}
        
        {(!content.sections || content.sections.length === 0) && (
          <div className="text-center py-12 text-muted-foreground font-serif italic">
            This module currently has no content sections.
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentDetailView;

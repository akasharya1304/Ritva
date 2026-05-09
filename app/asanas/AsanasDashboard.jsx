"use client";
import React, { useState } from "react";
import AsanasClientWrapper from "./AsanasClientWrapper";
import AsanasTableWrapper from "./AsanasTableWrapper";
import AsanaContentTableWrapper from "./AsanaContentTableWrapper";
import { FaListUl, FaFileAlt } from "react-icons/fa";

const AsanasDashboard = () => {
  const [view, setView] = useState("list"); // 'list' or 'content'

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl text-foreground">Asanas</h1>
          <p className="text-sm text-muted-foreground font-serif">आसन प्रबंधन — Manage Yoga Poses & Content</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6">
          {/* Toggle Switch */}
          <div className="flex p-1 bg-muted/50 rounded-xl border border-border">
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                view === "list" 
                  ? "bg-card text-primary shadow-soft border border-border" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FaListUl className="w-3.5 h-3.5" />
              Asanas List
            </button>
            <button
              onClick={() => setView("content")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                view === "content" 
                  ? "bg-card text-primary shadow-soft border border-border" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FaFileAlt className="w-3.5 h-3.5" />
              Asanas Content
            </button>
          </div>

          <AsanasClientWrapper asanasView={Boolean(view === "list")} />
        </div>
      </div>

      <div className="ornament-line w-full" />
      
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {view === "list" ? <AsanasTableWrapper /> : <AsanaContentTableWrapper />}
      </div>
    </div>
  );
};

export default AsanasDashboard;

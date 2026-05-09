"use client";
import React, { useState, useEffect } from "react";
import DataTable from "@/components/comman/DataTable";
import CustomDialog from "@/components/comman/CustomDialog";
import { FaChevronLeft, FaChevronRight, FaBookOpen } from "react-icons/fa";

const AsanaContentTableWrapper = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchContent = async (page) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/asana-content?page=${page}&limit=10`);
      const result = await res.json();
      setData(result.data || []);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Failed to fetch asana content:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchContent(newPage);
    }
  };

  const handleView = (content) => {
    setSelectedContent(content);
    setIsDialogOpen(true);
  };

  const columns = [
    {
      header: "S.No",
      accessor: "id",
      render: (id, d, index) => (
        <div className="w-10 h-10 bg-muted/30 border border-border rounded flex items-center justify-center text-[14px] font-bold text-muted-foreground">
          {(pagination.page - 1) * pagination.limit + index + 1}
        </div>
      )
    },
    { header: "Title", accessor: "title" },
    { 
      header: "Summary", 
      accessor: "summary",
      render: (summary) => <p className="line-clamp-1 max-w-xs">{summary}</p>
    },
    { 
      header: "Sections", 
      accessor: "details",
      render: (details) => <span>{details?.length || 0} sections</span>
    }
  ];

  return (
    <div className="space-y-4">
      <DataTable 
        data={data} 
        columns={columns} 
        isLoading={loading}
        onView={handleView}
        emptyMessage="No asana content found. Click Add Content to start." 
      />
      
      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-4 py-4 bg-card sanskrit-border mt-4 shadow-soft">
        <div className="text-sm text-muted-foreground font-serif">
          Showing <span className="font-medium text-foreground">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
          <span className="font-medium text-foreground">
            {Math.min(pagination.page * pagination.limit, pagination.total)}
          </span> of{" "}
          <span className="font-medium text-foreground">{pagination.total}</span> contents
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1 || loading}
            className="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1">
            {[...Array(pagination.totalPages)].map((_, i) => {
              const pageNum = i + 1;
              if (
                pagination.totalPages <= 5 ||
                pageNum === 1 ||
                pageNum === pagination.totalPages ||
                (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                      pagination.page === pageNum
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                (pageNum === 2 && pagination.page > 3) ||
                (pageNum === pagination.totalPages - 1 && pagination.page < pagination.totalPages - 2)
              ) {
                return <span key={pageNum} className="px-1 text-muted-foreground">...</span>;
              }
              return null;
            })}
          </div>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages || loading}
            className="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Details Dialog */}
      <CustomDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={selectedContent?.title || "Content Details"}
        maxWidth="max-w-4xl"
      >
        {selectedContent && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FaBookOpen className="text-primary w-6 h-6" />
                <h3 className="text-3xl font-display text-foreground">{selectedContent.title}</h3>
              </div>
              <p className="text-lg font-serif text-muted-foreground leading-relaxed italic">
                {selectedContent.summary}
              </p>
            </div>

            <div className="ornament-line w-full" />

            {/* Sections */}
            {selectedContent.details?.length > 0 && (
              <div className="space-y-8 px-2">
                {selectedContent.details.map((section, index) => (
                  <div key={index} className="space-y-3">
                    <h4 className="text-xl font-display text-primary/80 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {section.heading}
                    </h4>
                    <p className="text-base font-serif text-foreground leading-relaxed whitespace-pre-wrap pl-3.5 border-l border-border/50">
                      {section.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CustomDialog>
    </div>
  );
};

export default AsanaContentTableWrapper;

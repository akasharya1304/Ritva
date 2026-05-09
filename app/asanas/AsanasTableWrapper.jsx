"use client";
import React, { useState, useEffect } from "react";
import DataTable from "@/components/comman/DataTable";
import CustomDialog from "@/components/comman/CustomDialog";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const AsanasTableWrapper = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedAsana, setSelectedAsana] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchAsanas = async (page) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/asanas?page=${page}&limit=10`);
      const result = await res.json();
      setData(result.data || []);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Failed to fetch asanas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsanas(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchAsanas(newPage);
    }
  };

  const handleView = (asana) => {
    setSelectedAsana(asana);
    setIsDialogOpen(true);
  };

  const columns = [
    {
      header: "Order",
      accessor: "id",
      render: (id, d, index) => (
        <div className="w-10 h-10 bg-muted/30 border border-border rounded flex items-center justify-center text-[14px] font-bold text-muted-foreground">
          {(pagination.page - 1) * pagination.limit + index + 1}
        </div>
      )
    },
    {
      header: "Image",
      accessor: "details",
      render: (details) => {
        const url = details?.pic?.[0];
        if (!url) return <div className="w-10 h-10 bg-muted/30 border border-border rounded flex items-center justify-center text-[10px] text-muted-foreground">No img</div>;
        return <img src={url} alt="pose" className="w-10 h-10 object-cover border border-border rounded" />;
      }
    },
    { header: "Asana Name", accessor: "asanaName" },
    { header: "Category", accessor: "category" },
    { header: "Group", accessor: "group" },
    { header: "Type", accessor: "type" }
  ];

  return (
    <div className="space-y-4">
      <DataTable 
        data={data} 
        columns={columns} 
        isLoading={loading}
        onView={handleView}
        emptyMessage="No yoga poses found. Click Add Pose to start." 
      />
      
      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-4 py-4 bg-card sanskrit-border mt-4 shadow-soft">
        <div className="text-sm text-muted-foreground font-serif">
          Showing <span className="font-medium text-foreground">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
          <span className="font-medium text-foreground">
            {Math.min(pagination.page * pagination.limit, pagination.total)}
          </span> of{" "}
          <span className="font-medium text-foreground">{pagination.total}</span> asanas
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

      {/* Asana Details Dialog */}
      <CustomDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={selectedAsana?.asanaName || "Asana Details"}
        maxWidth="max-w-4xl"
      >
        {selectedAsana && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Large Image Header */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border shadow-lg">
              {selectedAsana.details?.pic?.[0] ? (
                <img 
                  src={selectedAsana.details.pic[0]} 
                  alt={selectedAsana.asanaName}
                  className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-muted/30 flex items-center justify-center text-muted-foreground italic font-serif">
                  No image available
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-8">
                <div>
                  <h3 className="text-3xl font-display text-white mb-2">{selectedAsana.asanaName}</h3>
                  <div className="flex gap-4">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs text-white uppercase tracking-wider">
                      {selectedAsana.category}
                    </span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs text-white uppercase tracking-wider">
                      {selectedAsana.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-display uppercase tracking-widest text-primary/60 mb-2">Category & Group</h4>
                  <p className="text-lg font-serif text-foreground">
                    {selectedAsana.category} — <span className="text-muted-foreground">{selectedAsana.group}</span>
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xs font-display uppercase tracking-widest text-primary/60 mb-2">Breathing</h4>
                  <p className="text-base font-serif text-muted-foreground leading-relaxed italic">
                    {selectedAsana.details?.breathing || "N/A"}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-display uppercase tracking-widest text-primary/60 mb-2">Awareness</h4>
                  <p className="text-base font-serif text-muted-foreground leading-relaxed">
                    {selectedAsana.details?.awareness || "N/A"}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-display uppercase tracking-widest text-primary/60 mb-2">Benefits</h4>
                  <p className="text-base font-serif text-muted-foreground leading-relaxed">
                    {selectedAsana.details?.benefits || "N/A"}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-display uppercase tracking-widest text-primary/60 mb-2">Contraindications</h4>
                  <p className="text-base font-serif text-muted-foreground leading-relaxed bg-danger/5 p-4 rounded-xl border border-danger/10">
                    {selectedAsana.details?.contraindications || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Steps Section */}
            {selectedAsana.details?.steps?.length > 0 && (
              <div className="px-2">
                <h4 className="text-xs font-display uppercase tracking-widest text-primary/60 mb-4">Steps to Perform</h4>
                <div className="space-y-4">
                  {selectedAsana.details.steps.map((step, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-muted/10 rounded-xl border border-border/30 hover:bg-muted/20 transition-all">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <p className="text-base font-serif text-foreground pt-1 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Practice Note */}
            {selectedAsana.details?.practiceNote && (
              <div className="px-2 pb-6">
                <div className="p-6 bg-accent/5 border border-accent/10 rounded-2xl">
                  <h4 className="text-xs font-display uppercase tracking-widest text-accent mb-3">Master's Note</h4>
                  <p className="text-base font-serif text-muted-foreground italic leading-relaxed">
                    {selectedAsana.details.practiceNote}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CustomDialog>
    </div>
  );
};

export default AsanasTableWrapper;

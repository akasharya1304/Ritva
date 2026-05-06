"use client";
import React from "react";
import DataTable from "@/components/comman/DataTable";

const AsanasTableWrapper = ({ data }) => {
  const columns = [
    {
      header: "Order",
      accessor: "id",
      render: (id, d, index) => <div className="w-10 h-10 bg-muted/30 border border-border rounded flex items-center justify-center text-[14px] font-bold text-muted-foreground">{index + 1}</div>
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
    <DataTable 
      data={data} 
      columns={columns} 
      emptyMessage="No yoga poses found. Click Add Pose to start." 
    />
  );
};

export default AsanasTableWrapper;

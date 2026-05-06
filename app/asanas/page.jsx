import React from "react";
import AsanasClientWrapper from "./AsanasClientWrapper";
import AsanasTableWrapper from "./AsanasTableWrapper";
import { prisma } from "@/lib/prisma";

const AdminAsanas = async () => {
  const asanas = await prisma.yogaPose.findMany({
    orderBy: { createdAt: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-display text-2xl text-foreground">Asanas</h1>
          <p className="text-sm text-muted-foreground font-serif">आसन प्रबंधन — Manage Yoga Poses</p>
        </div>
        <AsanasClientWrapper />
      </div>
      <div className="ornament-line w-full" />
      
      <AsanasTableWrapper data={asanas} />
    </div>
  );
};

export default AdminAsanas;
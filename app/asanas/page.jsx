import { FaUser } from "react-icons/fa";

const AdminAsanas = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-foreground">Asanas</h1>
        <p className="text-sm text-muted-foreground font-serif">आसन प्रबंधन — Manage Yoga Poses</p>
      </div>
      <div className="ornament-line w-full" />
      <div className="card-yoga rounded-xl p-12 text-center">
        <FaUser className="w-16 h-16 mx-auto text-primary/20 mb-4" />
        <h3 className="font-display text-xl text-foreground">Asana Module</h3>
        <p className="text-muted-foreground font-serif mt-2 max-w-md mx-auto">
          Connect a database to manage asana records. This module will show asanas & postures.
        </p>
      </div>
    </div>
  );
};

export default AdminAsanas;
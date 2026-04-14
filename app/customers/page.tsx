import { FaUser } from "react-icons/fa";

const AdminCustomers = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-foreground">Customers</h1>
        <p className="text-sm text-muted-foreground font-serif">ग्राहक प्रबंधन — Customer Management</p>
      </div>
      <div className="ornament-line w-full" />
      <div className="card-yoga rounded-xl p-12 text-center">
        <FaUser className="w-16 h-16 mx-auto text-primary/20 mb-4" />
        <h3 className="font-display text-xl text-foreground">Customer Module</h3>
        <p className="text-muted-foreground font-serif mt-2 max-w-md mx-auto">
          Connect a database to manage customer records. This module will show registered users and their practice history.
        </p>
      </div>
    </div>
  );
};

export default AdminCustomers;
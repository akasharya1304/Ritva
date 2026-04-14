import { IoFlowerOutline } from "react-icons/io5";
import { MdPeople, MdLibraryBooks } from "react-icons/md";

export default function DashboardPage() {
  const stats = [
    { label: "Active Asanas", value: "108", icon: IoFlowerOutline, color: "text-saffron" },
    { label: "Total Customers", value: "1,240", icon: MdPeople, color: "text-blue-500" },
    { label: "Library Books", value: "450", icon: MdLibraryBooks, color: "text-sage" },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl text-foreground">Welcome back, Admin</h1>
        <p className="font-body text-muted-foreground italic">शुभमस्तु — May there be wellness for all.</p>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="card-yoga p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-body text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-display mt-1">{stat.value}</p>
            </div>
            <stat.icon className={`text-4xl ${stat.color} opacity-80`} />
          </div>
        ))}
      </div>

      {/* Placeholder for Recent Activity */}
      <div className="card-yoga p-8 rounded-2xl min-h-75 flex items-center justify-center border-dashed">
        <p className="text-muted-foreground font-body">Main dashboard analytics and charts will go here.</p>
      </div>
    </div>
  );
}
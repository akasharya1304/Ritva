"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

// React Icons
import { 
  MdDashboard, 
  MdPeople, 
  MdLibraryBooks,  
} from "react-icons/md";
import { 
  IoFlowerOutline, 
  IoHeadset, 
  IoPersonCircleOutline,
  IoChevronDown
} from "react-icons/io5";

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mediaOpen, setMediaOpen] = useState(true);

  const mainItems = [
    { href: "/", icon: MdDashboard, label: "Dashboard" },
    { href: "/asanas", icon: IoFlowerOutline, label: "Asanas" },
    { href: "/customers", icon: MdPeople, label: "Customers" },
  ];

  const isActive = (path) => 
    path === "/" ? pathname === "/" : pathname?.startsWith(path);

  return (
    <aside className="w-64 h-screen border-r border-border bg-background flex flex-col lotus-pattern sticky top-0">
      {/* Brand Section */}
      <div className="p-6 border-b border-border/50">
        <h2 className="font-display text-2xl text-saffron flex items-center gap-2">
          <span>🕉</span> Ritva
        </h2>
        <p className="text-[11px] text-foreground font-body uppercase tracking-widest mt-1">
          योग प्रशासन
        </p>
        
      </div>

      {/* Navigation Content */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
        
        {/* Main Modules Group */}
        <div>
          <p className="px-3 text-[10px] font-display tracking-[0.2em] text-foreground/60 mb-3 uppercase">
            Main Modules
          </p>
          <ul className="space-y-1">
            {mainItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-body",
                    isActive(item.href)
                      ? "bg-saffron/10 text-saffron-dark shadow-sm ring-1 ring-saffron/20 font-bold"
                      : "text-foreground hover:bg-cream-dark/50 font-medium"
                  )}
                >
                  <item.icon className="text-xl" />
                  <span className="text-[15px]">{item.label}</span>
                </Link>
              </li>
            ))}

            {/* Collapsible Media Section */}
            <li>
              <button
                onClick={() => setMediaOpen(!mediaOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-foreground hover:bg-cream-dark/50 hover:text-foreground transition-all font-body cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <MdLibraryBooks className="text-xl" />
                  <span className="text-[15px]">Media Vault</span>
                </div>
                <IoChevronDown 
                  className={cn(
                    "text-sm transition-transform duration-300", 
                    mediaOpen && "rotate-180"
                  )} 
                />
              </button>
              
              {/* Submenu with slide-down feel */}
              <div className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out ml-4 border-l-2 border-saffron/10",
                mediaOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"
              )}>
                <ul className="py-1 space-y-1">
                  <li>
                    <Link
                      href="/media/books"
                      className={cn(
                        "block px-5 py-2 text-sm font-body rounded-r-lg transition-colors",
                        isActive("/media/books")
                          ? "text-saffron-dark font-semibold bg-saffron/5"
                          : "text-foreground hover:text-saffron"
                      )}
                    >
                      Books & Manuscripts
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/media/audio"
                      className={cn(
                        "flex items-center gap-2 px-5 py-2 text-sm font-body rounded-r-lg transition-colors",
                        isActive("/media/audio")
                          ? "text-saffron-dark font-semibold bg-saffron/5"
                          : "text-foreground hover:text-saffron"
                      )}
                    >
                      <IoHeadset className="text-xs" />
                      Audio Tracks
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>

        {/* Settings Group */}
        <div className="pt-1 border-t border-border/30">
          <Link
            href="/profile"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-body",
              isActive("/profile")
                ? "bg-saffron/10 text-saffron-dark ring-1 ring-saffron/20"
                : "text-foreground hover:bg-cream-dark/50 hover:text-foreground"
            )}
          >
            <IoPersonCircleOutline className="text-xl" />
            <span className="text-[15px]">Admin Profile</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
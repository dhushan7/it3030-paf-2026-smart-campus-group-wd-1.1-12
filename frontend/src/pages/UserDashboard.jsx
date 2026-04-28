import React from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, Ticket, ClipboardList, PlusCircle, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function UserDashboard() {
  const { user } = useAuth();

  // Define the dashboard cards based on the Navbar's user links
  const dashboardCards = [
    {
      id: "catalogue",
      to: "/catalogue",
      eyebrow: "Resources",
      title: "Catalogue",
      description: "Browse available resources, equipment, and spaces across the smart campus.",
      accent: "from-cyan-500/20 to-blue-500/10",
      textColor: "text-cyan-300",
      icon: <LayoutGrid size={28} />,
    },
    {
      id: "my-tickets",
      to: "/tickets",
      eyebrow: "Support",
      title: "My Tickets",
      description: "Track your IT and maintenance requests or submit a new support ticket.",
      accent: "from-purple-500/20 to-fuchsia-500/10",
      textColor: "text-purple-300",
      icon: <Ticket size={28} />,
    },
    {
      id: "my-bookings",
      to: "/bookings/mine",
      eyebrow: "Personal",
      title: "My Bookings",
      description: "Review your requests, check statuses, and cancel approved bookings.",
      accent: "from-emerald-500/20 to-teal-500/10",
      textColor: "text-emerald-300",
      icon: <ClipboardList size={28} />,
    },
    {
      id: "new-booking",
      to: "/bookings/new",
      eyebrow: "Request",
      title: "New Booking",
      description: "Create a fresh booking request for dates, times, and specific attendees.",
      accent: "from-amber-500/20 to-orange-500/10",
      textColor: "text-amber-300",
      icon: <PlusCircle size={28} />,
    },
    {
      id: "profile",
      to: "/profile",
      eyebrow: "Settings",
      title: "My Profile",
      description: "Manage your personal details, preferences, and account security.",
      accent: "from-rose-500/20 to-pink-500/10",
      textColor: "text-rose-300",
      icon: <User size={28} />,
    },
  ];

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Hero Section */}
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),_transparent_32%),rgba(15,23,42,0.82)] p-8 shadow-2xl backdrop-blur-xl">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/80">
            Welcome Back
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
            Hello, {user?.name || "Student"}
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Your central hub for navigating the smart campus. Quickly access the resource catalogue, 
            manage your active bookings, and check on your support tickets all in one place.
          </p>
        </div>

        {/* Quick Links Grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {dashboardCards.map((card) => (
            <Link
              key={card.id}
              to={card.to}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${card.accent} p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-${card.textColor.split('-')[1]}-500/20`}
            >
              {/* Icon & Eyebrow */}
              <div className="flex items-start justify-between">
                <div className={`rounded-xl bg-white/5 p-3 backdrop-blur-md border border-white/10 ${card.textColor} transition-transform duration-300 group-hover:scale-110`}>
                  {card.icon}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">
                  {card.eyebrow}
                </p>
              </div>

              {/* Text Content */}
              <div className="mt-6">
                <h2 className="text-2xl font-semibold text-white group-hover:text-white/90">
                  {card.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-300/90">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Optional: Add a secondary section below for recent activity or stats */}
      <section className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-6 md:p-8 backdrop-blur-md">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-xs font-semibold uppercase tracking-[0.28em] text-purple-300/80">
               Overview
             </p>
             <h2 className="mt-2 text-2xl font-semibold text-white">Recent Activity</h2>
           </div>
           <Link to="/profile" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
             View all history &rarr;
           </Link>
         </div>
         
         {/* Placeholder for future activity list */}
         <div className="mt-6 rounded-2xl border border-white/5 bg-white/5 p-8 text-center border-dashed">
            <p className="text-slate-400 text-sm">Your recent tickets and bookings will appear here.</p>
         </div>
      </section>
    </div>
  );
}
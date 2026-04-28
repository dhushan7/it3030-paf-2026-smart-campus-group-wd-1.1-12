import { useEffect, useState } from "react";
import BookingFormStyled from "./BookingFormStyled";
import BookingList from "./BookingList";
import BookingRequests from "./BookingRequests";

const sections = [
  {
    id: "new-booking",
    eyebrow: "Request",
    title: "New Booking",
    description: "Create a fresh booking request with resource, date, time range, purpose, and attendee count.",
    accent: "from-cyan-500/20 to-blue-500/10",
    component: <BookingFormStyled />,
  },
  {
    id: "my-bookings",
    eyebrow: "Personal",
    title: "My Bookings",
    description: "Review your own requests, check current statuses, and cancel approved bookings when needed.",
    accent: "from-emerald-500/20 to-teal-500/10",
    component: <BookingList />,
  },
  {
    id: "admin-bookings",
    eyebrow: "Review",
    title: "Admin Bookings",
    description: "Filter the booking queue and move requests through approval or rejection with reasons.",
    accent: "from-amber-500/20 to-rose-500/10",
    component: <BookingRequests />,
  },
];

export default function BookingsPage() {
  const [activeSection, setActiveSection] = useState(sections[0].id);

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash?.replace("#", "");
      if (hash && sections.some((section) => section.id === hash)) {
        setActiveSection(hash);
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),_transparent_32%),rgba(15,23,42,0.82)] p-8 shadow-2xl backdrop-blur-xl">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/80">
            Booking Hub
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
            Manage every booking workflow from one place
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Use this page to create booking requests, review your personal history, and handle
            admin approvals without jumping between separate routes.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`rounded-2xl border border-white/10 bg-gradient-to-br ${section.accent} p-5 transition-transform duration-200 hover:-translate-y-1`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-300">
                {section.eyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{section.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">{section.description}</p>
            </a>
          ))}
        </div>
      </section>

      <div className="sticky top-20 z-20 rounded-[1.4rem] border border-white/10 bg-[linear-gradient(120deg,rgba(8,16,42,0.92),rgba(20,18,52,0.9))] p-2 shadow-[0_18px_40px_rgba(7,12,28,0.45)] backdrop-blur-xl">
        <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
          Quick Navigation
        </div>
        <div className="overflow-x-auto">
          <div className="flex min-w-max gap-3">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                activeSection === section.id
                  ? "border-cyan-300/70 bg-cyan-400/20 text-white shadow-[0_0_0_1px_rgba(103,232,249,0.25)_inset]"
                  : "border-white/10 bg-white/5 text-slate-200 hover:border-cyan-400/40 hover:text-white"
              }`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.title}
            </a>
          ))}
          </div>
        </div>
      </div>

      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="scroll-mt-28 space-y-5 rounded-[2rem] border border-white/10 bg-slate-950/35 p-5 md:p-7"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
              {section.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">{section.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              {section.description}
            </p>
          </div>

          {section.component}
        </section>
      ))}
    </div>
  );
}

import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleAbout = () => scrollToSection(aboutRef);
    const handleContact = () => scrollToSection(contactRef);

    window.addEventListener("scroll-about", handleAbout);
    window.addEventListener("scroll-contact", handleContact);

    return () => {
      window.removeEventListener("scroll-about", handleAbout);
      window.removeEventListener("scroll-contact", handleContact);
    };
  }, []);

  return (
    <div className="font-sans text-white">

      {/* PAGE 1: HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 relative">
        
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mt-10">
          Smart Campus <span className="text-purple-400">IT & Booking Hub</span>
        </h1>

        <p className="mt-6 text-lg text-gray-300 max-w-xl">
          Report technical issues, request maintenance, and book campus resources seamlessly — all in one centralized platform.
        </p>

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => navigate('/login')}
            className="bg-purple-600 text-white px-8 py-3 rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:bg-purple-500 hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] transition-all duration-300 font-medium"
          >
            Get Started
          </button>

          <button
            onClick={() => scrollToSection(aboutRef)}
            className="border border-white/20 px-8 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 bg-white/5 backdrop-blur-sm font-medium"
          >
            Learn More
          </button>
        </div>
      </section>

      {/* PAGE 2: FEATURES */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
        
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white">Everything You Need to Succeed</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Explore the powerful tools designed to simplify your campus operations and streamline tech support.
          </p>
        </div>

        {/* 5 FEATURE CARDS */}
        <div className="flex flex-wrap justify-center gap-6 max-w-6xl w-full">
          
          {/* Tickets */}
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/30 hover:-translate-y-1 transition duration-300 w-full md:w-[30%] text-left border border-white/10">
            <div className="text-4xl mb-4">🎫</div>
            <h3 className="text-xl font-bold mb-2 text-white">IT Ticketing</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Quickly submit support tickets for software bugs, hardware failures, or network issues, and track their resolution status in real-time.
            </p>
          </div>

          {/* Bookings */}
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/30 hover:-translate-y-1 transition duration-300 w-full md:w-[30%] text-left border border-white/10">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-bold mb-2 text-white">Resource Bookings</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Browse the campus catalogue and reserve projectors, labs, meeting rooms, or specialized equipment with our easy-to-use booking system.
            </p>
          </div>

          {/* Maintenance */}
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/30 hover:-translate-y-1 transition duration-300 w-full md:w-[30%] text-left border border-white/10">
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="text-xl font-bold mb-2 text-white">Maintenance Workspace</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              A dedicated workspace for technicians to manage assigned tasks, update ticket statuses, and log resolution notes efficiently.
            </p>
          </div>

          {/* Admin Tools */}
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/30 hover:-translate-y-1 transition duration-300 w-full md:w-[46%] text-left border border-white/10">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2 text-white">Admin Controls</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Comprehensive dashboards for administrators to manage user roles, oversee booking requests, and assign technicians to priority tickets.
            </p>
          </div>

          {/* Communication */}
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/30 hover:-translate-y-1 transition duration-300 w-full md:w-[46%] text-left border border-white/10">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-bold mb-2 text-white">Seamless Communication</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Stay in the loop with active ticket comment sections and instant updates between users, technicians, and administrators.
            </p>
          </div>

        </div>
      </section>

      {/* PAGE 3: ABOUT */}
      <section
        ref={aboutRef}
        className="min-h-screen flex items-center justify-center px-6 py-12"
      >
        <div className="grid md:grid-cols-2 gap-10 max-w-6xl items-center">

          <div>
            <h2 className="text-4xl font-bold mb-4 text-white">About Our Platform</h2>
            <p className="text-gray-400 leading-relaxed text-lg">
              Smart Campus is designed to bridge the gap between campus staff, students, and the IT department. Whether you need a quick technical repair, software installation, or need to book a conference room for your next big presentation, our platform ensures every request is handled efficiently by the right people.
            </p>

            <button
              onClick={() => navigate('/login')}
              className="mt-8 bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-500 transition shadow-md font-semibold"
            >
              Join Now
            </button>
          </div>

          <div className="relative h-80 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 group">

            {/* VIDEO */}
            <video
              src="/video/preview.mp4"   
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-colors duration-500 group-hover:bg-black/40">
              <span className="text-white text-2xl font-bold tracking-wide drop-shadow-lg">
                🏢 Smart Campus
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* PAGE 4: CONTACT (Updated layout without form) */}
      <section
        ref={contactRef}
        className="min-h-screen flex items-center justify-center px-6 py-12"
      >
        <div className="max-w-5xl w-full flex flex-col items-center text-center gap-12">

          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Get in <span className="text-purple-400">Touch</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Have questions about the platform or need immediate administrative support? Reach out to us anytime through the channels below.
            </p>
          </div>

          {/* CONTACT CARDS - Centered Grid */}
          <div className="grid md:grid-cols-3 gap-6 w-full">
            {/* Contact Card 1 */}
            <div className="flex flex-col items-center gap-4 bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/10 hover:bg-white/10 hover:border-purple-500/30 hover:-translate-y-2 transition-all duration-300 group">
              <div className="bg-purple-500/10 text-purple-400 text-4xl p-5 rounded-2xl group-hover:bg-purple-500/20 transition-colors shadow-[0_0_15px_rgba(147,51,234,0.1)]">
                📧
              </div>
              <div>
                <p className="font-bold text-white text-xl mb-1">Email</p>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">support@smartcampus.edu</p>
              </div>
            </div>

            {/* Contact Card 2 */}
            <div className="flex flex-col items-center gap-4 bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/10 hover:bg-white/10 hover:border-purple-500/30 hover:-translate-y-2 transition-all duration-300 group">
              <div className="bg-purple-500/10 text-purple-400 text-4xl p-5 rounded-2xl group-hover:bg-purple-500/20 transition-colors shadow-[0_0_15px_rgba(147,51,234,0.1)]">
                📞
              </div>
              <div>
                <p className="font-bold text-white text-xl mb-1">IT Helpdesk</p>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">+94 77 123 4567</p>
              </div>
            </div>

            {/* Contact Card 3 */}
            <div className="flex flex-col items-center gap-4 bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/10 hover:bg-white/10 hover:border-purple-500/30 hover:-translate-y-2 transition-all duration-300 group">
              <div className="bg-purple-500/10 text-purple-400 text-4xl p-5 rounded-2xl group-hover:bg-purple-500/20 transition-colors shadow-[0_0_15px_rgba(147,51,234,0.1)]">
                📍
              </div>
              <div>
                <p className="font-bold text-white text-xl mb-1">Location</p>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">Main Admin Block, Sri Lanka</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
    };

    try {
      const res = await fetch("http://localhost:8086/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Message sent successfully!");
        e.target.reset();
      } else {
        alert("Failed to send message");
      }
    } catch (error) {
      console.error(error);
      alert("Error sending message");
    }
  };

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

      {/* PAGE 4: CONTACT */}
      <section
        ref={contactRef}
        className="min-h-screen flex items-center justify-center px-6 py-12"
      >
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10">

          {/* LEFT SIDE - INFO */}
          <div className="space-y-6 flex flex-col justify-center">
            <h2 className="text-4xl font-bold text-white">Get in Touch</h2>
            <p className="text-gray-400 text-lg">
              Have questions about the platform or need immediate administrative support? Reach out to us anytime.
            </p>

            <div className="space-y-4 mt-4">

              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-white/10 transition hover:bg-white/10">
                <div className="bg-purple-500/20 text-purple-400 text-2xl p-4 rounded-full">📧</div>
                <div>
                  <p className="font-bold text-white">Email</p>
                  <p className="text-gray-400">support@smartcampus.edu</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-white/10 transition hover:bg-white/10">
                <div className="bg-purple-500/20 text-purple-400 text-2xl p-4 rounded-full">📞</div>
                <div>
                  <p className="font-bold text-white">IT Helpdesk</p>
                  <p className="text-gray-400">+94 77 123 4567</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-white/10 transition hover:bg-white/10">
                <div className="bg-purple-500/20 text-purple-400 text-2xl p-4 rounded-full">📍</div>
                <div>
                  <p className="font-bold text-white">Location</p>
                  <p className="text-gray-400">Main Admin Block, Sri Lanka</p>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE - FORM */}
          <div className="bg-[#0f1115]/60 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/10">

            <h3 className="text-2xl font-bold mb-6 text-center text-white">
              Send a Message
            </h3>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* NAME */}
              <input
                name="name"
                className="w-full border border-white/10 bg-white/5 p-4 rounded-xl focus:bg-white/10 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-white placeholder-gray-500"
                placeholder="Your Name"
                required
              />

              {/* EMAIL */}
              <input
                type="email"
                name="email"
                className="w-full border border-white/10 bg-white/5 p-4 rounded-xl focus:bg-white/10 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-white placeholder-gray-500"
                placeholder="Your Email"
                required
              />

              {/* MESSAGE */}
              <textarea
                name="message"
                className="w-full border border-white/10 bg-white/5 p-4 rounded-xl focus:bg-white/10 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-white placeholder-gray-500 resize-none"
                rows="5"
                placeholder="How can we help you?"
                required
              />

              {/* BUTTON */}
              <button className="w-full bg-purple-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-purple-500 transition-colors shadow-[0_0_15px_rgba(147,51,234,0.2)] hover:shadow-[0_0_25px_rgba(147,51,234,0.4)]">
                Send Message 🚀
              </button>
            </form>

          </div>
        </div>
      </section>
    </div>
  );
}
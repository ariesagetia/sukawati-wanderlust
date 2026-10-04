import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSetting, fetchDestinations } from "@/lib/supabase";
import { Phone, Mail, MapPin } from "lucide-react";

// For the WhatsApp icon we'll use a generic MessageCircle or an SVG if preferred, but lucide doesn't have a specific whatsapp icon.
// Let's use a custom SVG for WhatsApp to make it exact.
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
  </svg>
);

export function SiteChrome({ children }: { children: ReactNode }) {
  const { data: whatsapp } = useQuery({ 
    queryKey: ["setting", "whatsapp"], 
    queryFn: () => fetchSetting("whatsapp") 
  });
  const { data: emailSetting } = useQuery({ 
    queryKey: ["setting", "email"], 
    queryFn: () => fetchSetting("email") 
  });
  const { data: destinations } = useQuery({
    queryKey: ["destinations"],
    queryFn: () => fetchDestinations()
  });
  
  // Clean the number for the wa.me link
  const waNumber = (whatsapp || "+62 812-3456-7890").replace(/[^0-9]/g, "");
  const waDisplay = whatsapp || "+62 812-3456-7890";
  const emailDisplay = emailSetting || "info@sukawatihub.com";

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <header className="fixed top-4 left-0 right-0 w-full z-50 px-6 pointer-events-none">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-3 bg-white/70 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full pointer-events-auto transition-all">
          <Link to="/" className="text-xl font-bold tracking-tighter text-emerald-600">
            SUKAWATI <span className="font-light text-neutral-900">HUB</span>
          </Link>
          <nav className="flex gap-8 text-sm font-semibold text-neutral-600">
            <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <Link to="/destinasi" className="hover:text-emerald-600 transition-colors">Explore</Link>
            <Link to="/admin" className="hover:text-emerald-600 transition-colors">Admin</Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">{children}</main>
      
      {/* Dark Footer */}
      <footer className="bg-[#2D2D2D] text-neutral-300 py-16 text-sm">
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Logo & Contact Info */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-6 md:items-start">
              <div className="md:order-2 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <WhatsAppIcon />
                  <span>{waDisplay}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <span>{emailDisplay}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Jl. Raya Sukawati, Gianyar,<br/>Bali - Indonesia</span>
                </div>
              </div>
              <div className="md:order-1 shrink-0 mt-2">
                <Link to="/" className="text-3xl font-bold tracking-tighter text-white block">
                  SUKAWATI<br/><span className="text-4xl">HUB.</span>
                </Link>
                <p className="text-[10px] tracking-widest mt-1 uppercase text-neutral-400">Creative Hub</p>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-1"></div>

          {/* Links Columns */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <h4 className="text-white font-bold mb-1">Our Company</h4>
            <Link to="/" className="hover:text-white transition-colors">About Us</Link>
            <Link to="/" className="hover:text-white transition-colors">Our Tenants</Link>
            <Link to="/" className="hover:text-white transition-colors">News</Link>
            <Link to="/" className="hover:text-white transition-colors">Career</Link>
          </div>
          
          <div className="md:col-span-2 flex flex-col gap-3">
            <h4 className="text-white font-bold mb-1">What's Around</h4>
            {destinations?.slice(0, 4).map(d => (
              <Link key={d.id} to="/destinasi/$slug" params={{ slug: d.slug }} className="hover:text-white transition-colors truncate">
                {d.name}
              </Link>
            ))}
            {(!destinations || destinations.length === 0) && (
              <span className="text-neutral-500 italic">No destinations yet</span>
            )}
          </div>
          
          <div className="md:col-span-2 flex flex-col gap-3">
            <h4 className="text-white font-bold mb-1">Festival</h4>
            {destinations?.filter(d => d.group_type === "festival").slice(0, 4).map(d => (
              <Link key={d.id} to="/destinasi/$slug" params={{ slug: d.slug }} className="hover:text-white transition-colors truncate">
                {d.name}
              </Link>
            ))}
            {(!destinations || destinations.filter(d => d.group_type === "festival").length === 0) && (
              <span className="text-neutral-500 italic">No events yet</span>
            )}
          </div>
          
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${waNumber}`} 
        target="_blank" 
        rel="noreferrer" 
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-[0_4px_12px_rgba(37,211,102,0.4)] hover:bg-[#20b858] hover:scale-105 transition-all font-medium"
      >
        <WhatsAppIcon />
        <span>Contact Us</span>
      </a>
    </div>
  );
}

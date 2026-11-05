import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSetting, fetchDestinations } from "@/lib/supabase";
import { Mail, MapPin, Compass, Sparkles } from "lucide-react";

// Custom SVG icon for WhatsApp
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
  
  const waNumber = (whatsapp || "+62 812-3456-7890").replace(/[^0-9]/g, "");
  const waDisplay = whatsapp || "+62 812-3456-7890";
  const emailDisplay = emailSetting || "info@sukawatihub.com";

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-emerald-100 selection:text-emerald-900">
      {/* Modern Floating Header */}
      <header className="fixed top-4 left-0 right-0 w-full z-50 px-4 md:px-6 pointer-events-none">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-5 py-3 bg-white/85 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full pointer-events-auto transition-all">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-lg md:text-xl font-bold tracking-tight text-emerald-700 transition-colors group-hover:text-emerald-800">
              DESA WISATA <span className="font-light text-neutral-900">SUKAWATI</span>
            </span>
            <span className="hidden lg:inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
              <Sparkles className="w-3 h-3 text-emerald-600" /> Budaya Bali
            </span>
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-neutral-600">
            <Link to="/" className="hover:text-emerald-700 transition-colors">Beranda</Link>
            <a href="/#about" className="hover:text-emerald-700 transition-colors hidden sm:inline">Tentang</a>
            <a href="/#rute" className="hover:text-emerald-700 transition-colors flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>Rute</span>
            </a>
            <Link to="/destinasi" className="hover:text-emerald-700 transition-colors">Daya Tarik</Link>
            <Link to="/admin" className="text-neutral-400 hover:text-neutral-800 transition-colors text-xs font-medium border-l border-neutral-200 pl-4 sm:pl-6">Admin</Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">{children}</main>
      
      {/* Dark Modern Footer */}
      <footer className="bg-neutral-900 text-neutral-300 py-16 text-sm border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Logo & Contact Info */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div>
              <Link to="/" className="text-2xl font-bold tracking-tight text-white block">
                DESA WISATA <span className="text-emerald-400 font-light">SUKAWATI</span>
              </Link>
              <p className="text-xs uppercase tracking-widest mt-1 text-emerald-400/90 font-medium">
                Wisata Berbasis Budaya, Seni, Tradisi & Kehidupan Lokal
              </p>
              <p className="mt-3 text-xs leading-relaxed text-neutral-400">
                Discover the Culture, Art, and Authentic Life of Bali. Menghadirkan pengalaman wisata budaya yang memberikan manfaat bagi masyarakat sekaligus melestarikan warisan leluhur.
              </p>
            </div>

            <div className="flex flex-col gap-3 text-xs text-neutral-300 pt-2 border-t border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-950 flex items-center justify-center text-emerald-400 shrink-0">
                  <WhatsAppIcon />
                </div>
                <span>{waDisplay}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-950 flex items-center justify-center text-emerald-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <span>{emailDisplay}</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-950 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Desa Sukawati, Kec. Sukawati, Kab. Gianyar, Bali - Indonesia</span>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-1"></div>

          {/* Navigasi Footer */}
          <div className="md:col-span-2 flex flex-col gap-3 text-xs">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-1">Informasi</h4>
            <a href="/#about" className="hover:text-emerald-400 transition-colors">Tentang Sukawati</a>
            <a href="/#pengalaman" className="hover:text-emerald-400 transition-colors">Pengalaman Wisata</a>
            <a href="/#rute" className="hover:text-emerald-400 transition-colors">12 Rute Perjalanan</a>
            <a href="/#why-visit" className="hover:text-emerald-400 transition-colors">Mengapa Berkunjung</a>
            <Link to="/admin" className="hover:text-emerald-400 transition-colors">Portal Pengelola</Link>
          </div>
          
          <div className="md:col-span-2 flex flex-col gap-3 text-xs">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-1">Daya Tarik</h4>
            <Link to="/destinasi" className="hover:text-emerald-400 transition-colors">Semua Destinasi</Link>
            <Link to="/destinasi/homestay-wayan-rutawan" className="hover:text-emerald-400 transition-colors">Homestay & Akomodasi</Link>
            <Link to="/destinasi/pura-desa-lan-puseh" className="hover:text-emerald-400 transition-colors">Pura Desa lan Puseh</Link>
            <Link to="/destinasi/pasar-seni-sukawati-jajan-pan-kladi" className="hover:text-emerald-400 transition-colors">Pasar Seni Sukawati</Link>
            <Link to="/destinasi/pertunjukan-tari-kecak-dan-tari-legong" className="hover:text-emerald-400 transition-colors">Tari Kecak & Legong</Link>
          </div>
          
          <div className="md:col-span-2 flex flex-col gap-3 text-xs">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-1">Semboyan</h4>
            <div className="rounded-xl bg-neutral-800/80 p-4 border border-neutral-700/60">
              <p className="text-emerald-400 font-serif italic text-base leading-snug">
                "Where Culture Comes Alive"
              </p>
              <p className="text-[11px] text-neutral-400 mt-2">
                Come, Explore, Experience, and Celebrate Sukawati!
              </p>
            </div>
          </div>
          
        </div>

        <div className="mx-auto max-w-6xl px-6 mt-12 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} Desa Wisata Sukawati, Gianyar, Bali. Seluruh hak cipta dilindungi.</p>
          <p className="text-[11px]">Rute Perjalanan Desa Wisata Berbasis Budaya</p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${waNumber}?text=Halo%20Desa%20Wisata%20Sukawati,%20saya%20ingin%20bertanya%20mengenai%20kunjungan%20wisata.`} 
        target="_blank" 
        rel="noreferrer" 
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-[0_6px_20px_rgba(37,211,102,0.45)] hover:bg-[#20b858] hover:scale-105 active:scale-95 transition-all font-semibold text-sm cursor-pointer"
        aria-label="Hubungi WhatsApp Pengelola Desa Wisata Sukawati"
      >
        <WhatsAppIcon />
        <span>Tanya Kami</span>
      </a>
    </div>
  );
}

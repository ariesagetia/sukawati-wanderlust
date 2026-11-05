import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white px-4 overflow-hidden">
      {/* Dekorasi lingkaran background */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-50" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-emerald-100 opacity-60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-emerald-100" />

      <div className="relative z-10 max-w-lg text-center">
        {/* Angka 404 dekoratif besar */}
        <p
          className="text-[10rem] leading-none font-bold select-none"
          style={{ fontFamily: "var(--font-display)", color: "rgba(5,150,105,0.08)" }}
        >
          404
        </p>

        {/* Icon */}
        <div className="-mt-12 mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
            <span className="text-3xl">🌴</span>
          </div>
        </div>

        <h1
          className="text-3xl font-bold text-neutral-800"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Halaman Tidak Ditemukan
        </h1>
        <p className="mt-3 text-neutral-500 text-base leading-relaxed">
          Maaf, halaman yang kamu cari tidak ada atau sudah dipindahkan.<br />
          Yuk kembali dan jelajahi potensi Desa Wisata Sukawati!
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 shadow-md shadow-emerald-200"
          >
            🏠 Kembali ke Beranda
          </Link>
          <Link
            to="/destinasi"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200 bg-white px-6 py-3 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
          >
            🗺️ Lihat Destinasi
          </Link>
        </div>

        <p className="mt-10 text-xs text-neutral-400">
          Desa Wisata Sukawati · Gianyar, Bali
        </p>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white px-4 overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-red-50" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-orange-50 opacity-60" />

      <div className="relative z-10 max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-200">
            <span className="text-3xl">⚠️</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-neutral-800" style={{ fontFamily: "var(--font-display)" }}>
          Halaman Gagal Dimuat
        </h1>
        <p className="mt-3 text-neutral-500 text-sm leading-relaxed">
          Terjadi kesalahan pada server. Silakan coba refresh halaman atau kembali ke beranda.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 shadow-md shadow-emerald-200"
          >
            🔄 Coba Lagi
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            🏠 Ke Beranda
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Desa Wisata Sukawati — Discover the Culture, Art, and Authentic Life of Bali" },
      { name: "description", content: "Desa Wisata Sukawati, Gianyar, Bali. Wisata berbasis budaya, seni, tradisi, kerajinan, dan kehidupan masyarakat lokal." },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Desa Wisata Sukawati — Discover the Culture, Art, and Authentic Life of Bali" },
      { property: "og:description", content: "Wisata berbasis budaya, seni, tradisi, dan kehidupan masyarakat lokal di Sukawati, Gianyar, Bali." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Karla:wght@400;500;700&display=swap" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

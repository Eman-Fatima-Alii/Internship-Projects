import "./globals.css";

export const metadata = {
  title: "Pulse — Real-Time News & AI Intelligence",
  description:
    "Pulse delivers live global headlines, category discovery, TV broadcast insights, and AI-powered news analysis in real time.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Runs before React hydrates so the page never flashes the wrong
            theme on load. Reads the saved preference, falling back to the
            OS-level color-scheme setting if the user hasn't chosen yet. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("pulse-theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark");}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-[#f8fafc] dark:bg-[#070a0f] text-slate-900 dark:text-slate-100 min-h-screen selection:bg-indigo-500 selection:text-white transition-colors duration-300 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}



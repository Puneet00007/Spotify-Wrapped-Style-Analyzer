"use client";

import { motion } from "framer-motion";

export default function Home() {
  const handleConnect = () => {
    window.location.href = '/api/auth/login';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">

      {/* Background Visualizer Animation (Simplified CSS Bars) */}
      <div className="absolute inset-0 z-0 flex items-end justify-center opacity-20 pb-0 gap-2 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="w-12 bg-spotify-green rounded-t-lg mix-blend-screen"
            animate={{ height: ['10vh', '40vh', '15vh', '60vh', '20vh'] }}
            transition={{
              duration: Math.random() * 2 + 2,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: Math.random() * -5,
            }}
          />
        ))}
      </div>

      <div className="z-10 text-center max-w-3xl flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-display font-bold text-6xl md:text-8xl tracking-tight leading-none mb-6 drop-shadow-2xl">
            Your music.<br/>
            <span className="text-spotify-green">Your identity.</span><br/>
            Decoded.
          </h1>
          <p className="text-lg md:text-2xl text-white/70 mb-12 max-w-xl mx-auto font-body">
            Connect Spotify and discover your listening archetype, mood spectrum, and music alter ego.
          </p>

          <button
            onClick={handleConnect}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-spotify-green rounded-full hover:bg-green-400 hover:scale-105 hover:shadow-[0_0_40px_rgba(29,185,84,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-spotify-green focus:ring-offset-spotify-black"
          >
            <svg className="w-6 h-6 mr-3 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.241 1.2zM19.08 10.5c-3.96-2.34-10.44-2.58-14.22-1.44-.6.18-1.2-.18-1.38-.78-.18-.6.18-1.2.78-1.38 4.32-1.26 11.4-1.02 15.84 1.62.54.3 0.72 1.02.42 1.56-.24.48-.9.66-1.44.42z"/>
            </svg>
            Connect with Spotify
          </button>
        </motion.div>
      </div>
    </div>
  );
}
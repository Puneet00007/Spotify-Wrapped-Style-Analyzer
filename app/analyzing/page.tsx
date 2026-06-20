"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { processUserData } from "../actions";

const STEPS = [
  "Authenticating securely...",
  "Fetching your top tracks...",
  "Analyzing audio DNA...",
  "Computing your archetype...",
  "Designing your card..."
];

import { Suspense } from "react";

function AnalyzingContent() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    // Cycle text to show progress while data loads
    interval = setInterval(() => {
      setStep((prev) => {
        if (prev < STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 1200);

    // Start data fetch immediately on mount
    processUserData().then((res) => {
      if (res.success && res.data) {
        // Cache data in sessionStorage so results page can pick it up
        // without passing a massive object via URL.
        sessionStorage.setItem('soundself_data', JSON.stringify(res.data));

        // Ensure at least 3 seconds of loading screen for UX, even if fetch is fast
        setTimeout(() => {
             router.push('/results');
        }, 1500);
      } else {
         router.push('/?error=data_fetch_failed');
      }
    });

    return () => {
      clearInterval(interval);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-spotify-black overflow-hidden relative">

      {/* Waveform Animation */}
      <div className="flex items-center justify-center gap-2 mb-12 h-32">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-4 bg-spotify-green rounded-full"
            animate={{ height: ['20%', '100%', '20%'] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          />
        ))}
      </div>

      {/* Text Animation */}
      <div className="h-12 relative overflow-hidden flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
          <motion.h2
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-display font-medium text-white/90 absolute"
          >
            {STEPS[step]}
          </motion.h2>
        </AnimatePresence>
      </div>

    </div>
  );
}

export default function AnalyzingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-spotify-black" />}>
      <AnalyzingContent />
    </Suspense>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { decodeShareData } from "@/lib/spotify/share";
import ShareCard from "@/components/cards/ShareCard";
import { motion } from "framer-motion";

export default function SharedCardPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (params.id) {
      const decoded = decodeShareData(params.id as string);
      if (decoded) {
        setData(decoded);
      } else {
        router.push('/');
      }
    }
  }, [params.id, router]);

  if (!data) return <div className="min-h-screen bg-spotify-black" />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-spotify-black text-white relative overflow-hidden">

      <div className="w-full max-w-[400px] aspect-[9/16] relative z-10 shadow-2xl shadow-black/50">
        <ShareCard data={data} />
      </div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => router.push('/')}
        className="mt-8 relative z-10 group inline-flex items-center justify-center px-6 py-3 font-bold text-black transition-all duration-200 bg-white rounded-full hover:scale-105"
      >
        Discover your SoundSelf →
      </motion.button>

    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ShareCard from "@/components/cards/ShareCard";
import DetailPanel from "@/components/layout/DetailPanel";

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Read the processed data from sessionStorage
    const cached = sessionStorage.getItem('soundself_data');
    if (cached) {
      try {
        setData(JSON.parse(cached));
      } catch(e) {
        setError(true);
      }
    } else {
        router.push('/');
    }
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-display mb-4 text-white">Spotify's being shy. Try again?</h2>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!data) {
    return <div className="min-h-screen bg-spotify-black" />;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden bg-spotify-black text-white">

      {/* Left Panel: The Card */}
      <div className="w-full lg:w-1/2 min-h-[100dvh] flex items-center justify-center p-4 sm:p-8 bg-black/50 relative">
        <div className="w-full max-w-[400px] lg:max-w-[450px] aspect-[9/16] relative z-10">
          <ShareCard data={data} id="share-card-node" />
        </div>
      </div>

      {/* Right Panel: The Details */}
      <div className="w-full lg:w-1/2 h-full lg:h-screen overflow-y-auto p-6 sm:p-12 pb-32 lg:pb-12 border-t lg:border-t-0 lg:border-l border-white/10">
        <DetailPanel data={data} />
      </div>

    </div>
  );
}
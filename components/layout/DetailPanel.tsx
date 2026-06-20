import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Share2, Download, RotateCw } from 'lucide-react';
import html2canvas from 'html2canvas';
import JSConfetti from 'js-confetti';
import { encodeShareData } from '@/lib/spotify/share';
import { useState } from 'react';

export default function DetailPanel({ data }: { data: any }) {
  const [copied, setCopied] = useState(false);
  const { topTracks, topArtists, features, archetype } = data;

  const radarData = [
    { subject: 'Acoustic', A: features.acousticness * 100, fullMark: 100 },
    { subject: 'Valence', A: features.valence * 100, fullMark: 100 },
    { subject: 'Energy', A: features.energy * 100, fullMark: 100 },
    { subject: 'Dance', A: features.danceability * 100, fullMark: 100 },
    { subject: 'Speech', A: features.speechiness * 100, fullMark: 100 },
  ];

  const handleShareLink = () => {
    const encoded = encodeShareData(data);
    const url = `${window.location.origin}/card/${encoded}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = async (format: 'story' | 'square') => {
    const jsConfetti = new JSConfetti();
    jsConfetti.addConfetti({
      confettiColors: ['#1DB954', '#FFD700', '#FF66B2', '#1E90FF'],
    });

    const element = document.getElementById('share-card-node');
    if (!element) return;

    try {
      // Temporarily adjust classes for aspect ratio if needed, though html2canvas captures what's on screen.
      // We are forcing the aspect ratio in the CSS already.
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: null });
      const image = canvas.toDataURL("image/png");

      const link = document.createElement('a');
      link.href = image;
      link.download = `SoundSelf_${format}.png`;
      link.click();
    } catch (e) {
      console.error("Export failed", e);
    }
  };

  return (
    <div className="flex flex-col gap-10 max-w-xl mx-auto lg:mx-0">

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sticky top-0 bg-spotify-black/80 backdrop-blur-md pt-2 pb-4 z-20">
        <button
          onClick={() => handleExport('story')}
          className="flex-1 flex items-center justify-center gap-2 bg-white text-black font-bold py-3 px-4 rounded-full hover:bg-gray-200 transition"
        >
          <Download size={18} /> Export Story (9:16)
        </button>
        <button
          onClick={handleShareLink}
          className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white font-bold py-3 px-4 rounded-full hover:bg-white/20 transition"
        >
          <Share2 size={18} /> {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>

      <div>
        <h3 className="font-display text-2xl font-bold mb-2 text-spotify-green">The Breakdown</h3>
        <p className="text-white/70 text-sm leading-relaxed mb-6">
          Your listening habits strongly align with <strong>{archetype.primary.name}</strong>.
          {archetype.primary.description} We also detected undertones of {archetype.secondary.name}.
        </p>

        <div className="h-64 w-full bg-white/5 rounded-2xl p-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="You" dataKey="A" stroke="#1DB954" fill="#1DB954" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h4 className="font-bold text-sm text-white/50 uppercase tracking-wider mb-4">Top 5 Tracks (Current)</h4>
          <div className="flex flex-col gap-3">
            {topTracks.map((t: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-white/30 font-display font-bold w-4">{i+1}</span>
                <img src={t.album.images[2]?.url || t.album.images[0]?.url} className="w-10 h-10 rounded bg-white/10" alt="" />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium truncate">{t.name}</span>
                  <span className="text-xs text-white/50 truncate">{t.artists.map((a:any)=>a.name).join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-sm text-white/50 uppercase tracking-wider mb-4">Top 5 Artists</h4>
          <div className="flex flex-col gap-3">
            {topArtists.map((a: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-white/30 font-display font-bold w-4">{i+1}</span>
                <img src={a.images[2]?.url || a.images[0]?.url} className="w-10 h-10 rounded-full bg-white/10 object-cover" alt="" />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium truncate">{a.name}</span>
                  <span className="text-[10px] text-white/40 uppercase tracking-wider truncate">{a.genres[0] || 'Unknown'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
import GenreDonut from "../charts/GenreDonut";

export default function ShareCard({ data, id }: { data: any, id?: string }) {
  const { profile, archetype, mood, alterEgo, genres, stats } = data;

  return (
    <div
      id={id}
      className={`w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden relative flex flex-col bg-gradient-to-br ${archetype.primary.gradient}`}
    >
      {/* Noise Overlay */}
      <div className="absolute inset-0 z-0 noise-overlay opacity-30 mix-blend-overlay pointer-events-none"></div>

      {/* 1. Header Strip */}
      <div className="relative z-10 flex justify-between items-center p-5 pt-6">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold tracking-tight text-white/90 text-sm">SoundSelf</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-white/80">{profile.display_name || 'Listener'}</span>
          {profile.images?.[0]?.url && (
            <img src={profile.images[0].url} alt="Profile" className="w-6 h-6 rounded-full object-cover border border-white/20" />
          )}
          <svg className="w-4 h-4 fill-[#1DB954]" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.241 1.2zM19.08 10.5c-3.96-2.34-10.44-2.58-14.22-1.44-.6.18-1.2-.18-1.38-.78-.18-.6.18-1.2.78-1.38 4.32-1.26 11.4-1.02 15.84 1.62.54.3 0.72 1.02.42 1.56-.24.48-.9.66-1.44.42z"/></svg>
        </div>
      </div>

      {/* 2. Archetype Hero Block */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6">
        <h2 className="font-display font-bold text-5xl leading-[0.9] tracking-tighter mb-2 drop-shadow-lg">
          {archetype.primary.name.replace('The ', 'The\n')}
        </h2>
        <p className="text-sm font-medium text-white/70 mb-4 tracking-wide uppercase">
          + {archetype.secondary.name} undertones
        </p>
        <p className="text-sm text-white/90 leading-tight max-w-[85%]">
          {archetype.primary.description}
        </p>
      </div>

      {/* Middle Section: Split Grid */}
      <div className="relative z-10 h-32 flex border-y border-white/10 bg-black/10 backdrop-blur-sm">

        {/* 3. Mood Visual */}
        <div className="w-1/2 border-r border-white/10 p-4 flex flex-col justify-center relative">
          <div className="absolute inset-0 opacity-20 pointer-events-none grid grid-cols-2 grid-rows-2">
            <div className="border-r border-b border-white/30"></div>
            <div className="border-b border-white/30"></div>
            <div className="border-r border-white/30"></div>
            <div></div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-white/50 mb-1 z-10">Mood Zone</p>
          <p className="font-accent text-2xl z-10" style={{ color: mood.color }}>{mood.label}</p>
        </div>

        {/* 4. Genre DNA */}
        <div className="w-1/2 p-2 flex flex-col items-center justify-center relative">
          <div className="w-24 h-24 absolute right-4 opacity-80">
            <GenreDonut data={genres.macroData} />
          </div>
          <div className="w-full h-full flex flex-col justify-end p-2 z-10">
             <p className="text-[10px] uppercase font-bold text-white/60 text-left w-full leading-tight drop-shadow-md">
               {genres.topMicroGenres.slice(0,3).join(' • ')}
             </p>
          </div>
        </div>
      </div>

      {/* 5. Alter Ego Block */}
      <div className="relative z-10 p-6 bg-black/20 backdrop-blur-md flex-1 flex flex-col justify-center">
        <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1 font-bold">Your Music Alter Ego</p>
        <h3 className="font-display font-semibold text-3xl mb-2">{alterEgo.name}</h3>
        <p className="text-xs text-white/80 leading-relaxed max-w-[90%]">
          {alterEgo.description}
        </p>
      </div>

      {/* 6. Micro-Stats Row */}
      <div className="relative z-10 flex text-[10px] font-bold uppercase tracking-wider divide-x divide-white/10 border-t border-white/10 bg-black/40">
        <div className="flex-1 py-3 text-center">{stats.nightPct}% Night</div>
        <div className="flex-1 py-3 text-center text-[#FFD700]">Energy: {stats.energyScore}</div>
        <div className="flex-1 py-3 text-center text-[#1DB954]">{stats.genreCount} Genres</div>
      </div>

      {/* 7. Footer */}
      <div className="relative z-10 text-center py-2 bg-black text-[9px] font-medium tracking-widest text-white/40">
        SOUNDSELF.APP
      </div>

    </div>
  );
}
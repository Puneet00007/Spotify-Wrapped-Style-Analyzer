export type AudioFeatures = {
    valence: number;
    energy: number;
    danceability: number;
    acousticness: number;
    instrumentalness: number;
    speechiness: number;
    tempo: number;
    loudness: number;
  };

  export type Archetype = {
    id: string;
    name: string;
    description: string;
    gradient: string;
  };

  export const ARCHETYPES: Archetype[] = [
    {
      id: 'euphoric',
      name: 'The Euphoric Escapist',
      description: 'Lives for drops, festival anthems, and feel-good pop. You probably have 3 different "summer playlist" versions.',
      gradient: 'from-[var(--color-grad-euphoric-start)] to-[var(--color-grad-euphoric-end)]'
    },
    {
      id: 'midnight',
      name: 'The Midnight Philosopher',
      description: 'Listens to music like it\'s a therapy session. Knows every ambient/indie artist before they blow up.',
      gradient: 'from-[var(--color-grad-midnight-start)] to-[var(--color-grad-midnight-end)]'
    },
    {
      id: 'hypebeast',
      name: 'The Hypebeast Sonic',
      description: 'Hip-hop, trap, and rap dominate. Has strong opinions about who\'s the GOAT.',
      gradient: 'from-[var(--color-grad-hypebeast-start)] to-[var(--color-grad-hypebeast-end)]'
    },
    {
      id: 'nostalgic',
      name: 'The Nostalgic Dreamer',
      description: 'Folk, classic rock, singer-songwriter. Probably has a vinyl collection.',
      gradient: 'from-[var(--color-grad-nostalgic-start)] to-[var(--color-grad-nostalgic-end)]'
    },
    {
      id: 'chaos',
      name: 'The Controlled Chaos Agent',
      description: 'Listening history looks like a random number generator. Genuinely unpredictable taste.',
      gradient: 'from-[var(--color-grad-chaos-start)] to-[var(--color-grad-chaos-end)]'
    },
    {
      id: 'cinematic',
      name: 'The Cinematic Soul',
      description: 'Orchestral, film scores, post-rock, jazz. Probably mentally writing a movie while listening.',
      gradient: 'from-[var(--color-grad-cinematic-start)] to-[var(--color-grad-cinematic-end)]'
    },
    {
      id: 'social',
      name: 'The Social Architect',
      description: 'Always knows what to play at a party. Tracks trends without being a slave to them.',
      gradient: 'from-[var(--color-grad-social-start)] to-[var(--color-grad-social-end)]'
    },
    {
      id: 'intensity',
      name: 'The Intensity Chaser',
      description: 'Metal, dark electronic, aggressive genres. Uses music as emotional armor.',
      gradient: 'from-[var(--color-grad-intensity-start)] to-[var(--color-grad-intensity-end)]'
    },
    {
      id: 'eclectic',
      name: 'The Eclectic Curator',
      description: 'A walking music encyclopedia. Impossible to pin down to just one vibe.',
      gradient: 'from-[var(--color-grad-eclectic-start)] to-[var(--color-grad-eclectic-end)]'
    },
    {
      id: 'deepcut',
      name: 'The Deep-Cut Devotee',
      description: 'Underground, obscure, or niche. Probably hates when their favorite artist blows up.',
      gradient: 'from-[var(--color-grad-deepcut-start)] to-[var(--color-grad-deepcut-end)]'
    }
  ];

  export function calculateAverages(featuresList: AudioFeatures[]): AudioFeatures {
    if (featuresList.length === 0) return { valence: 0, energy: 0, danceability: 0, acousticness: 0, instrumentalness: 0, speechiness: 0, tempo: 0, loudness: 0 };

    const sums = featuresList.reduce((acc, curr) => ({
      valence: acc.valence + curr.valence,
      energy: acc.energy + curr.energy,
      danceability: acc.danceability + curr.danceability,
      acousticness: acc.acousticness + curr.acousticness,
      instrumentalness: acc.instrumentalness + curr.instrumentalness,
      speechiness: acc.speechiness + curr.speechiness,
      tempo: acc.tempo + curr.tempo,
      loudness: acc.loudness + curr.loudness,
    }), { valence: 0, energy: 0, danceability: 0, acousticness: 0, instrumentalness: 0, speechiness: 0, tempo: 0, loudness: 0 });

    return {
      valence: sums.valence / featuresList.length,
      energy: sums.energy / featuresList.length,
      danceability: sums.danceability / featuresList.length,
      acousticness: sums.acousticness / featuresList.length,
      instrumentalness: sums.instrumentalness / featuresList.length,
      speechiness: sums.speechiness / featuresList.length,
      tempo: sums.tempo / featuresList.length,
      loudness: sums.loudness / featuresList.length,
    };
  }

  export function determineArchetype(avgs: AudioFeatures, topGenres: string[], avgPopularity: number): { primary: Archetype, secondary: Archetype, score: number } {
    let scores = ARCHETYPES.map(a => ({ archetype: a, score: 0 }));

    const genreStr = topGenres.join(' ').toLowerCase();

    // 1. Euphoric Escapist (High V, High E, High D)
    scores.find(s => s.archetype.id === 'euphoric')!.score += (avgs.valence * 10) + (avgs.energy * 10) + (avgs.danceability * 10);
    if (genreStr.includes('pop') || genreStr.includes('dance')) scores.find(s => s.archetype.id === 'euphoric')!.score += 5;

    // 2. Midnight Philosopher (Low V, Low E, High I)
    scores.find(s => s.archetype.id === 'midnight')!.score += ((1 - avgs.valence) * 10) + ((1 - avgs.energy) * 10) + (avgs.instrumentalness * 15);
    if (genreStr.includes('indie') || genreStr.includes('ambient')) scores.find(s => s.archetype.id === 'midnight')!.score += 5;

    // 3. Hypebeast Sonic (High Speechiness, High E, Low A)
    scores.find(s => s.archetype.id === 'hypebeast')!.score += (avgs.speechiness * 20) + (avgs.energy * 10) + ((1 - avgs.acousticness) * 5);
    if (genreStr.includes('rap') || genreStr.includes('hip hop') || genreStr.includes('trap')) scores.find(s => s.archetype.id === 'hypebeast')!.score += 15;

    // 4. Nostalgic Dreamer (Mixed V, Low T, High A)
    scores.find(s => s.archetype.id === 'nostalgic')!.score += (avgs.acousticness * 15) + (Math.abs(0.5 - avgs.valence) * -10 + 5);
    if (genreStr.includes('folk') || genreStr.includes('rock') || genreStr.includes('soul')) scores.find(s => s.archetype.id === 'nostalgic')!.score += 10;

    // 5. Cinematic Soul (High I, Low Speechiness)
    scores.find(s => s.archetype.id === 'cinematic')!.score += (avgs.instrumentalness * 20) + ((1 - avgs.speechiness) * 10);
    if (genreStr.includes('score') || genreStr.includes('jazz') || genreStr.includes('classical')) scores.find(s => s.archetype.id === 'cinematic')!.score += 10;

    // 6. Social Architect (High D, Moderate V, High Pop)
    scores.find(s => s.archetype.id === 'social')!.score += (avgs.danceability * 15) + (avgPopularity / 100 * 10);

    // 7. Intensity Chaser (High E, Low V, Low D)
    scores.find(s => s.archetype.id === 'intensity')!.score += (avgs.energy * 15) + ((1 - avgs.valence) * 10) + ((1 - avgs.danceability) * 5);
    if (genreStr.includes('metal') || genreStr.includes('punk') || genreStr.includes('dark')) scores.find(s => s.archetype.id === 'intensity')!.score += 10;

    // 8. Deep-Cut Devotee (Low Pop)
    scores.find(s => s.archetype.id === 'deepcut')!.score += ((100 - avgPopularity) / 100 * 30);

    // 9. Eclectic Curator (Many genres)
    if (topGenres.length > 15) scores.find(s => s.archetype.id === 'eclectic')!.score += 25;

    // 10. Chaos Agent (High variance - simplified here as a random bump if others are low)
    scores.find(s => s.archetype.id === 'chaos')!.score += 10; // Baseline

    // Sort
    scores.sort((a, b) => b.score - a.score);

    return {
      primary: scores[0].archetype,
      secondary: scores[1].archetype,
      score: Math.min(Math.round((scores[0].score / 40) * 100), 99) // Normalizing mock score to max 99%
    };
  }

  export function determineMood(valence: number, energy: number) {
    if (valence >= 0.5 && energy >= 0.5) return { quadrant: "Radiant", label: "Joyful & Electric", color: "#FFD700" };
    if (valence < 0.5 && energy >= 0.5) return { quadrant: "Turbulent", label: "Intense & Driven", color: "#FF4500" };
    if (valence < 0.5 && energy < 0.5) return { quadrant: "Ethereal", label: "Melancholic & Reflective", color: "#1E90FF" };
    return { quadrant: "Serene", label: "Calm & Content", color: "#32CD32" };
  }

  export function generateAlterEgo(primaryId: string, moodQuadrant: string, topGenres: string[], v: number) {
    const prefixes = {
      Radiant: ['Solar', 'Neon', 'Luminous', 'Golden'],
      Turbulent: ['Crimson', 'Storm', 'Iron', 'Echo'],
      Ethereal: ['Luna', 'Midnight', 'Mist', 'Hollow'],
      Serene: ['Zenith', 'Dawn', 'Breeze', 'Crystal']
    };

    const suffixes = ['Vex', 'Static', 'Grit', 'Pulse', 'Wave', 'Drift', 'Spark'];

    // Randomly select based on mood and simple math pseudo-random
    const pList = prefixes[moodQuadrant as keyof typeof prefixes] || prefixes.Radiant;
    const prefix = pList[Math.floor(v * pList.length)];
    const suffix = suffixes[Math.floor((v * 10) % suffixes.length)];

    const genreStr = topGenres.slice(0, 3).join(', ');

    return {
      name: `${prefix} ${suffix}`,
      description: `A ${moodQuadrant.toLowerCase()} wanderer navigating the spaces between ${genreStr}. You carry the energy of ${primaryId} in your back pocket.`
    };
  }

  export function extractGenres(artists: any[]) {
    const genreCounts: Record<string, number> = {};
    artists.forEach((artist: any) => {
      artist.genres.forEach((g: string) => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    });

    const sorted = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);

    // Group into Macro
    const macros = [
      { name: 'Pop', value: 0, color: '#FF66B2' },
      { name: 'Hip-Hop/Rap', value: 0, color: '#FF3333' },
      { name: 'Rock/Alt', value: 0, color: '#3333FF' },
      { name: 'Electronic/Dance', value: 0, color: '#33FFCC' },
      { name: 'Indie/Folk', value: 0, color: '#FFB266' },
      { name: 'Other', value: 0, color: '#999999' }
    ];

    sorted.forEach(([g, count]) => {
      if (g.includes('pop')) macros[0].value += count;
      else if (g.includes('rap') || g.includes('hip hop')) macros[1].value += count;
      else if (g.includes('rock') || g.includes('alt')) macros[2].value += count;
      else if (g.includes('electronic') || g.includes('dance') || g.includes('house') || g.includes('techno')) macros[3].value += count;
      else if (g.includes('indie') || g.includes('folk')) macros[4].value += count;
      else macros[5].value += count;
    });

    return {
      topMicroGenres: sorted.slice(0, 5).map(g => g[0]),
      macroData: macros.filter(m => m.value > 0)
    };
  }

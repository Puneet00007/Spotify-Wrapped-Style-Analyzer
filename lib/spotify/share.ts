export function encodeShareData(data: any) {
  const minified = {
    p: data.profile.display_name,
    i: data.profile.images?.[0]?.url,
    a: data.archetype.primary.id,
    m: data.mood.quadrant,
    ml: data.mood.label,
    mc: data.mood.color,
    t: data.genres.topMicroGenres.slice(0,3),
    d: data.genres.macroData,
    en: data.alterEgo.name,
    ed: data.alterEgo.description,
    n: data.stats.nightPct,
    e: data.stats.energyScore,
    g: data.stats.genreCount
  };

  const str = JSON.stringify(minified);
  return btoa(encodeURIComponent(str));
}

import { ARCHETYPES } from './algorithm';

export function decodeShareData(encoded: string) {
  try {
    const str = decodeURIComponent(atob(encoded));
    const minified = JSON.parse(str);

    return {
      profile: {
        display_name: minified.p,
        images: minified.i ? [{url: minified.i}] : []
      },
      archetype: {
        primary: ARCHETYPES.find((a:any) => a.id === minified.a) || ARCHETYPES[0],
        secondary: { name: 'Hidden' }
      },
      mood: {
        quadrant: minified.m,
        label: minified.ml,
        color: minified.mc
      },
      genres: {
        topMicroGenres: minified.t,
        macroData: minified.d
      },
      alterEgo: {
        name: minified.en,
        description: minified.ed
      },
      stats: {
        nightPct: minified.n,
        energyScore: minified.e,
        genreCount: minified.g
      }
    };
  } catch (e) {
    console.error("Failed to decode share data", e);
    return null;
  }
}

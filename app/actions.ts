"use server";

import { cookies } from 'next/headers';
import { fetchAllUserData } from "@/lib/spotify/api";
import { calculateAverages, extractGenres, determineArchetype, determineMood, generateAlterEgo } from '@/lib/spotify/algorithm';

export async function processUserData() {
    try {
        const rawData = await fetchAllUserData();

        const avgs = calculateAverages(rawData.audioFeatures);
        const { topMicroGenres, macroData } = extractGenres(rawData.artists.medium);
        const avgPop = rawData.artists.medium.reduce((acc: number, a: any) => acc + a.popularity, 0) / (rawData.artists.medium.length || 1);

        const archetypeData = determineArchetype(avgs, topMicroGenres, avgPop);
        const moodData = determineMood(avgs.valence, avgs.energy);
        const alterEgoData = generateAlterEgo(archetypeData.primary.name, moodData.quadrant, topMicroGenres, avgs.valence);

        const nightCount = rawData.recent.filter((r: any) => {
          const hour = new Date(r.played_at).getHours();
          return hour >= 22 || hour <= 4;
        }).length;
        const nightPct = Math.round((nightCount / Math.max(rawData.recent.length, 1)) * 100);

        return {
          success: true,
          data: {
              profile: rawData.profile,
              topTracks: rawData.tracks.medium.slice(0, 5),
              topArtists: rawData.artists.medium.slice(0, 5),
              features: avgs,
              archetype: archetypeData,
              mood: moodData,
              alterEgo: alterEgoData,
              genres: { topMicroGenres, macroData },
              stats: {
                nightPct,
                energyScore: Math.round(avgs.energy * 100),
                genreCount: macroData.length + topMicroGenres.length
              }
          }
        };

    } catch (e: any) {
        console.error("Failed to process user data", e);
        return { success: false, error: e.message };
    }
}

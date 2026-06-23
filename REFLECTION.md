# Project Reflection

This document serves as the required reflection on the development of the SoundSelf application, detailing the challenges, successes, and future improvements.

## What was easy

1. **The UI/UX Implementation:** The user provided an incredibly detailed Product Requirements Document (PRD) regarding the visual expectations (e.g., Clash Display fonts, specific archetype gradients, SVG noise overlay, Framer Motion animations). Having such rigid design constraints made building the Tailwind UI straightforward and highly deterministic.
2. **The Algorithm Logic:** Grouping users into archetypes based on a math-based scoring matrix of Spotify's audio features (valence, energy, etc.) was fun and easy to implement using standard array reduction and sorting techniques.
3. **Stateless Sharing:** Implementing the "share a link" feature without a database by compressing the JSON result state into a base64 encoded URL parameter was a clean, effective solution that bypassed the need for complex Supabase/Postgres setups for this MVP.

## What was difficult

1. **Secure Authentication in Next.js App Router:** The PRD requested storing tokens in `localStorage` alongside a server-side Next.js environment. My initial implementation passed the tokens via URL parameters to reach the client, which triggered a critical security vulnerability alert during the pre-commit review. Refactoring the architecture to utilize `HttpOnly` server cookies while maintaining the intended client-side UX required careful orchestration between Server Actions and Client Components.
2. **Authentic Loading States:** The PRD requested a beautiful, multi-step loading screen (`/analyzing`). Initially, I mocked this with a `setTimeout`, which resulted in a disjointed UX where the user would see a loading screen, then a blank screen while the real data fetched. I had to refactor the data fetching out of the `/results` page and into a Server Action triggered *by* the `/analyzing` page so the animations synced with actual network requests.

## What I would improve with more time

1. **Database Persistence:** Currently, sharing relies on massive base64 URL strings. While clever, this limits SEO Open Graph tags because the server can't dynamically generate `<meta>` tags based on client-side URL hashes. With more time, I would connect the provided Supabase instance, save the generated user profile to a `profiles` table, and use a short UUID for sharing (e.g., `/card/123-abc`). This would allow Next.js to server-side render the exact image for Twitter/Discord link previews.
2. **Rate Limiting & Error Handling:** The Spotify API rate limits aggressively. Currently, the app groups audio feature requests into batches of 100, but it lacks a robust exponential backoff retry mechanism.
3. **Responsive Image Export:** `html2canvas` can sometimes struggle with complex CSS (like CSS grid, specific flexbox layouts, or SVG filters across different browsers). With more time, I would move the image generation to the backend using a headless browser (like Puppeteer/Playwright) or Vercel's `@vercel/og` image generation library to ensure perfect, pixel-accurate exports regardless of the user's mobile browser quirks.
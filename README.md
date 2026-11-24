<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/ef788b68-a4c4-47c3-84e6-55cf6756733f

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Publishing static blog articles

The existing design is shared by all articles. No CMS, database, runtime API, or admin area is required.

1. Copy `src/data/blogs/_template.ts` to `src/data/blogs/your-unique-slug.ts`.
2. Set `id` and `slug` to the same unique URL identifier. Add a title, short `summary`, unique SEO `description`, category, tags, author, and real `date`/`isoDate`. Do not backdate a new post.
3. Write complete HTML in `content`, following the existing format. Use one H2 per major section with a unique `id`; add corresponding `tableOfContents` entries. Use existing routes for internal links. Add two or three related article links at the end.
4. Store an optimized local cover under `public/images/blog/`. Set `coverImage` and accurate `coverImageAlt`; optionally supply `coverImageSmall` for an 800px variant. Record `imageSource`, `imageCredit`, and `imageLicense`. Do not use a discovery-page URL as an image URL.
5. Run `npm run build`. This checks TypeScript, discovers articles, generates the sitemap, builds the application, and prerenders each route to `dist/blogs/<slug>/index.html`. Reading time is calculated automatically at 200 words per minute.
6. Check the article on desktop and mobile, its sources, spelling, images, and links. Commit the content and assets to GitHub. The configured Vercel build publishes the static output.

New files are discovered by the existing `import.meta.glob`; no manual route registration is needed. Files beginning with `_` are helpers/templates and must not export published posts. Keep `slug` and `isoDate` as literal fields so sitemap discovery can read them.

The November 2026 article batch and its editorial limitations are documented in `docs/blog-implementation-report.md`.

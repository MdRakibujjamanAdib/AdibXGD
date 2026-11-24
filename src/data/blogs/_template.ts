/**
 * BLOG ARTICLE TEMPLATE:
 * Duplicate this file and rename it (e.g. `my-awesome-article.ts`).
 * Any `.ts` file placed in `src/data/blogs/` is automatically discovered and loaded!
 */
export default {
  id: "my-article-slug",
  slug: "my-article-slug",
  title: "Your Article Title Here",
  subtitle: "A compelling subtitle explaining the engineering insight or architectural breakdown.",
  summary: "A brief summary for previews and search engine optimization.",
  category: "AI & Systems", // 'Game Development' | 'Sustainable Tech' | 'AI & Systems' | '3D & Computer Graphics' | 'Algorithms & Systems'
  tags: ["AI", "Architecture", "Engineering"],
  date: "January 01, 2026",
  isoDate: "2026-01-01T00:00:00.000Z",
  readTime: "6 min read",
  author: {
    name: "Md Rakibujjaman Adib",
    role: "Erasmus+ Game Developer & AI Architect",
    avatar: "/MdRakibujamanAdib.jpg"
  },
  coverImage: "/images/blogs/your-cover-image.png",
  coverImageAlt: "Alt text describing the cover image",
  tableOfContents: [
    { id: "section-1", title: "First Section Title", level: 2 },
    { id: "section-2", title: "Second Section Title", level: 2 }
  ],
  content: `
    <h2 id="section-1">First Section Title</h2>
    <p>Write your detailed technical prose here. You can include paragraphs, images, and code blocks.</p>

    <h2 id="section-2">Second Section Title</h2>
    <p>Write more technical insights here.</p>
  `,
  featured: false
};

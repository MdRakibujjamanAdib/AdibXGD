# How to Add & Edit Projects in Your Portfolio

This guide explains how to add new projects to your website by editing the `src/data/projects.ts` file, and how to format them beautifully.

---

## 1. Project Structure

Every project in `projects.ts` is an object inside the `projects` array. 

Here is a complete template for adding a new project:

```typescript
  {
    id: "my-new-project-url-slug", // (Required) Converts to /projects/my-new-project-url-slug
    title: "The Project Title Here", // (Required) Large title on the detail page
    category: "3D", // (Required) The filter category it belongs to
    role: "Lead Designer", // (Optional) Shows next to category: 3D / Lead Designer
    summary: "A short one-sentence summary for the card.", // (Required) Shows on the projects grid list
    description: `
      <p style="text-align: justify; margin-bottom: 1rem;">
        This is the main detailed overview. You can use <b>HTML tags</b> in this section exactly like this! 
        Using backticks (\`) makes it easy to write multiple lines.
      </p>
    `, // (Required) The detailed text. Fully supports HTML.
    thumbnail: "/images/Projects Images/the-thumb.png", // (Required) The cover photo
    images: [ // (Optional) The masonry gallery below the overview
      "/images/Projects Images/gallery-1.png",
      "/images/Projects Images/gallery-2.png"
    ],
    videoUrl: "https://youtu.be/...", // (Optional) YouTube or Facebook video link
    demoUrl: "https://my-live-site.com", // (Optional) Adds the "Live Demo" button
    repoUrl: "https://github.com/...", // (Optional) Adds the "Source Code" GitHub button
    tags: ["React", "Blender", "Design"], // (Required) Tech stack bubbles
    date: "2024-05-01", // (Required) YYYY-MM-DD
    featured: true // (Required) Set true to show on the Home Page Selected Work section
  },
```

---

## 2. Formatting the Description (`description`)

Because of our recent update, the `description` field now supports raw HTML formatting. 

**CRITICAL RULE:** When writing a description with multiple lines or HTML tags, **do not use quotes** (`"..."` or `'...'`). You must use **backticks** (`` `...` ``). 

### Examples of Formatting
* **Bold text:** `<b>Important word</b>` or `<strong>Important word</strong>`
* **Italic text:** `<i>Creative concept</i>`
* **Break a line:** Use `<br/>`
* **Create a paragraph:** `<p>This is a paragraph.</p>`
* **Justify text (clean edges):** `<p style="text-align: justify;">Your text</p>`
* **Add space between paragraphs:** `<p style="margin-bottom: 1.5rem;">Paragraph 1</p> <p>Paragraph 2</p>`

---

## 3. Working with Images & Video

### Image Paths
Always start image paths with `/images/...`. **Do not use `public/images/`.**
✅ Right: `/images/Projects Images/my-logo.png`
❌ Wrong: `public/images/Projects Images/my-logo.png`

### Aspect Ratios
* **Thumbnails (`thumbnail`):** Best exported in **4:3 landscape**.
* **Gallery Images (`images`):** You can use **any aspect ratio**! The gallery layout will automatically pack landscape, portrait, and square images tightly together.

### Video Embeds
To add a video at the top of the project details, just copy the public URL and paste it into `videoUrl`. The system will automatically convert it to a player.
* **YouTube:** `https://www.youtube.com/watch?v=12345` or `https://youtu.be/12345`
* **Facebook:** `https://www.facebook.com/watch/?v=12345`

## 4. Categories & Filtering
The `category` you type must exactly match one of the categories listed on the `Projects` page filter tabs.
Currently, those are:
* `3D`
* `Web & Automation`
* `Brand Identity`
* `Video Editing`

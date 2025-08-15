import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import fs from "fs";
import path from "path";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BlogPostMeta {
  title: string;
  author: string;
  tags: string[];
  description: string;
  published: boolean;
  date: string;
  slug: string;
  year: string;
  month: string;
  day: string;
}

export interface BlogPost {
  meta: BlogPostMeta;
  content: string;
}

// Parse a single markdown file
export function parseBlogMarkdown(filePath: string): BlogPost {
  const raw = fs.readFileSync(filePath, "utf-8");
  // Parse JSON frontmatter
  const jsonMatch = raw.match(/^{[\s\S]*?}/);
  if (!jsonMatch) throw new Error("No JSON frontmatter found");
  let meta: BlogPostMeta;
  try {
    meta = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error("Invalid JSON frontmatter in " + filePath);
  }
  // Infer year, month, day, slug from filename
  const parts = filePath.split(path.sep);
  const year = parts[parts.length - 2];
  const file = parts[parts.length - 1];
  if (!file || typeof file !== 'string') {
    throw new Error("Invalid file name in " + filePath);
  }
  const match = file.match(/(\d{2})-(\d{2})-(.+)\.md$/);
  if (!match) {
    throw new Error("Malformed file name: " + file);
  }
  const [, month, day, slugRaw] = match;
  meta.date = `${year}-${month}-${day}`;
  meta.slug = slugRaw;
  meta.year = year;
  meta.month = month;
  meta.day = day;
  // Get markdown content after separator
  const contentMatch = raw.match(/---\s*\n([\s\S]*)$/);
  const content = contentMatch ? contentMatch[1].trimStart() : '';
  return { meta, content };
}

// Recursively get all markdown files in posts
export function getAllBlogPosts(postsDir: string): BlogPost[] {
  const posts: BlogPost[] = [];
  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, entry);
      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath);
      } else if (entry.endsWith(".md")) {
        posts.push(parseBlogMarkdown(fullPath));
      }
    }
  }
  walk(postsDir);
  // Sort by date descending
  posts.sort((a, b) => b.meta.date.localeCompare(a.meta.date));
  return posts;
}

// --- VITE CLIENT-SIDE BLOG POST LOADER ---
export async function loadAllBlogPostsClient(): Promise<BlogPost[]> {
  // Use Vite's import.meta.glob to get all markdown files
  const modules = import.meta.glob('/src/posts/**/*.md', { query: '?raw', import: 'default' });
  const posts: BlogPost[] = [];
  for (const filePath in modules) {
    const raw = await modules[filePath]() as string;
    // Parse JSON frontmatter
    const jsonMatch = raw.match(/^{[\s\S]*?}/);
    if (!jsonMatch) continue;
    let meta: BlogPostMeta;
    try {
      meta = JSON.parse(jsonMatch[0]);
    } catch {
      console.warn(`Skipping blog post with invalid JSON frontmatter: ${filePath}`);
      continue;
    }
    // Infer year, month, day, slug from filePath
    const parts = filePath.split('/');
    if (parts.length < 5) {
      console.warn(`Skipping malformed blog post path: ${filePath}`);
      continue;
    }
    const year = parts[3];
    const file = parts[4];
    if (!file || typeof file !== 'string') {
      console.warn(`Skipping blog post with missing or invalid file name: ${filePath}`);
      continue;
    }
    // Filename: MM-DD-slug.md
    const match = file.match(/(\d{2})-(\d{2})-(.+)\.md$/);
    if (!match) {
      console.warn(`Skipping blog post with malformed file name: ${file}`);
      continue;
    }
    const [, month, day, slugRaw] = match;
    meta.date = `${year}-${month}-${day}`;
    meta.slug = slugRaw;
    meta.year = year;
    meta.month = month;
    meta.day = day;
    // Get markdown content after separator
    const contentMatch = raw.match(/---\s*\n([\s\S]*)$/);
    const content = contentMatch ? contentMatch[1].trimStart() : '';
    posts.push({ meta, content });
  }
  // Sort by date descending
  posts.sort((a, b) => b.meta.date.localeCompare(a.meta.date));
  return posts;
}

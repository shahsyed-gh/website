import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { loadAllBlogPostsClient, type BlogPost } from "../lib/utils";

const Blog = () => {
  const [postsByYear, setPostsByYear] = useState<Record<string, BlogPost[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllBlogPostsClient().then(allPosts => {
      const grouped = allPosts.reduce((acc, post) => {
        const year = post.meta.year;
        if (!acc[year]) acc[year] = [];
        acc[year].push(post);
        return acc;
      }, {} as Record<string, typeof allPosts>);
      setPostsByYear(grouped);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-12 text-center">Loading blog posts...</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-foreground hover:text-muted-foreground transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Gradient Check;
            <span className="text-muted-foreground"> blogs by Shah Syed</span><span className="text-orange-500">.</span>
        </h1>
        {Object.keys(postsByYear).sort((a, b) => b.localeCompare(a)).map(year => (
          <div key={year} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{year}</h2>
            <ul className="space-y-6">
              {postsByYear[year].map(post => (
                <li key={post.meta.slug} className="border-b pb-4">
                  <Link to={`/blog/${post.meta.year}/${post.meta.month}/${post.meta.day}/${post.meta.slug}`} className="text-xl font-bold text-primary hover:text-primary/80 transition-colors">
                    {post.meta.title}
                  </Link>
                  <div className="text-sm text-muted-foreground mt-1">{post.meta.date} &middot; by {post.meta.author}</div>
                  <div className="mt-2 text-foreground">{post.meta.description}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {post.meta.tags.map(tag => (
                      <span key={tag} className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded border border-border">{tag}</span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Blog;
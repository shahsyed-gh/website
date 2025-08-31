import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { loadAllBlogPostsClient, type BlogPost } from "../lib/utils";
import NotFound from "./NotFound";
import { useMeta } from "../hooks/useMeta";

const Blog = () => {
  const { year: filterYear, month: filterMonth } = useParams();
  const [postsByYear, setPostsByYear] = useState<Record<string, BlogPost[]>>({});
  const [loading, setLoading] = useState(true);
  
  // Validate URL parameters
  const isValidYear = (year?: string): boolean => {
    if (!year) return true; // No year is valid (shows all)
    return /^\d{4}$/.test(year);
  };
  
  const isValidMonth = (month?: string): boolean => {
    if (!month) return true; // No month is valid
    return /^(0[1-9]|1[0-2])$/.test(month);
  };

  // Set meta tags for blog page
  const getPageTitle = () => {
    if (filterYear && filterMonth) return `Gradient Check; blogs from ${filterYear}/${filterMonth} — by Shah Syed`;
    if (filterYear) return `Gradient Check; blogs from ${filterYear} — by Shah Syed`;
    return 'Gradient Check; blogs — by Shah Syed';
  };

  const getPageDescription = () => {
    if (filterYear && filterMonth) return `Blog posts from ${filterYear}/${filterMonth} by Shah Syed, covering product management, AI, and technology insights.`;
    if (filterYear) return `Blog posts from ${filterYear} by Shah Syed, covering product management, AI, and technology insights.`;
    return 'Blog posts by Shah Syed, covering product management, AI, and technology insights.';
  };

  useEffect(() => {
    loadAllBlogPostsClient().then(allPosts => {
      let filteredPosts = allPosts;
      
      // Filter by year if specified
      if (filterYear) {
        filteredPosts = filteredPosts.filter(post => post.meta.year === filterYear);
      }
      
      // Filter by month if specified
      if (filterMonth) {
        filteredPosts = filteredPosts.filter(post => post.meta.month === filterMonth);
      }
      
      const grouped = filteredPosts.reduce((acc, post) => {
        const year = post.meta.year;
        if (!acc[year]) acc[year] = [];
        acc[year].push(post);
        return acc;
      }, {} as Record<string, typeof filteredPosts>);
      setPostsByYear(grouped);
      setLoading(false);
    });
  }, [filterYear, filterMonth]);

  useMeta({
    title: getPageTitle(),
    description: getPageDescription(),
    ogTitle: getPageTitle(),
    ogDescription: getPageDescription(),
  });
  
  // Check if parameters are valid
  if (!isValidYear(filterYear) || !isValidMonth(filterMonth)) {
    return <NotFound />;
  }

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
        <div className="mb-8">
          {(filterYear || filterMonth) && (
            <div className="mb-4">
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                ← All blog posts
              </Link>
            </div>
          )}
          <h1 className="text-4xl font-bold">
            Gradient Check;
            <span className="text-muted-foreground"> blogs by Shah Syed</span>
            <span className="text-orange-500">.</span>
          </h1>
          {filterYear && filterMonth && (
            <p className="text-lg text-muted-foreground mt-2">
              Posts from <Link to={`/blog/${filterYear}`} className="hover:text-foreground transition-colors">{filterYear}</Link>/<Link to={`/blog/${filterYear}/${filterMonth}`} className="hover:text-foreground transition-colors">{filterMonth}</Link>
            </p>
          )}
          {filterYear && !filterMonth && (
            <p className="text-lg text-muted-foreground mt-2">
              Posts from <Link to={`/blog/${filterYear}`} className="hover:text-foreground transition-colors">{filterYear}</Link>
            </p>
          )}
        </div>
        {Object.keys(postsByYear).sort((a, b) => b.localeCompare(a)).map(year => (
          <div key={year} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">
              <Link to={`/blog/${year}`} className="hover:text-primary transition-colors cursor-pointer">
                {year}
              </Link>
            </h2>
            <ul className="space-y-6">
              {postsByYear[year].map(post => (
                <li key={post.meta.slug} className="border-b pb-4">
                  <Link to={`/blog/${post.meta.year}/${post.meta.month}/${post.meta.day}/${post.meta.slug}`} className="text-xl font-bold text-primary hover:text-primary/80 transition-colors">
                    {post.meta.title}
                  </Link>
                  <div className="text-sm text-muted-foreground mt-1">{post.meta.date} &middot; by {post.meta.author} Syed</div>
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
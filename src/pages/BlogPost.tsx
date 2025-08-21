import { useParams, Link } from "react-router-dom";
import { loadAllBlogPostsClient } from "../lib/utils";
import NotFound from "./NotFound";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import rehypeRaw from "rehype-raw";
import { useMeta } from "../hooks/useMeta";

const BlogPost = () => {
  const { year, month, day, slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllBlogPostsClient().then(allPosts => {
      const found = allPosts.find(p =>
        p.meta.year === year &&
        p.meta.month === month &&
        p.meta.day === day &&
        p.meta.slug === slug
      );
      setPost(found || null);
      setLoading(false);
    });
  }, [year, month, day, slug]);

  // Update meta tags when post is loaded
  useMeta({
    title: post ? `${post.meta.title} — Shah Syed` : 'Shah Syed — Product Manager',
    description: post ? post.meta.description : 'Product manager that can innovate, engineer, and grow any solution.',
    ogTitle: post ? `${post.meta.title} — by Shah Syed` : 'Shah Syed — Product Manager',
    ogDescription: post ? post.meta.description : 'Product manager that can innovate, engineer, and grow any solution.',
  });

  if (loading) return <div className="p-12 text-center">Loading post...</div>;
  if (!post) return <NotFound />;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/blog" className="text-xl font-bold text-foreground hover:text-muted-foreground transition-colors">
              Back to Blogs
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold mb-2">{post.meta.title}</h1>
        <div className="text-sm text-muted-foreground mb-4">{post.meta.date} &middot; by {post.meta.author} Syed</div>
        <div className="mb-4 text-foreground">{post.meta.description}</div>
        <div className="mb-6 flex flex-wrap gap-2">
          {post.meta.tags.map(tag => (
            <span key={tag} className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded border border-border">{tag}</span>
          ))}
        </div>
        <article className="prose prose-lg max-w-none dark:prose-invert">
          <ReactMarkdown 
            rehypePlugins={[rehypeRaw]}
            components={{
              img: ({ src, alt, ...props }) => {
                // Fix relative image paths - convert to public directory paths
                let fixedSrc = src;
                if (src?.startsWith('../images/')) {
                  // Convert ../images/... to /images/...
                  fixedSrc = src.replace('../images/', '/images/');
                } else if (src?.startsWith('../')) {
                  // General relative path handling
                  fixedSrc = src.replace('../', '/');
                }
                return (
                  <img 
                    src={fixedSrc} 
                    alt={alt} 
                    {...props}
                    onError={(e) => {
                      // Fallback for missing images
                      e.currentTarget.src = '/placeholder.svg';
                      e.currentTarget.alt = alt + ' (image not found)';
                    }}
                  />
                );
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>
      </main>
    </div>
  );
};

export default BlogPost;
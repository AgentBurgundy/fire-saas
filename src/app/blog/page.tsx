import { getAllBlogPosts } from "@/lib/contentful";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "FireSaaS | Blog teaching you how to build SaaS easier.",
  description: "View blog posts teaching you how to build SaaS easier.",
  metadataBase: new URL("https://firesaas.dev/blog"),
  openGraph: {
    title: "FireSaaS | Blog",
    description: "View blog posts teaching you how to build SaaS easier.",
    url: "https://firesaas.dev/blog",
    siteName: "FireSaaS",
  },
  twitter: {
    card: "summary_large_image",
    title: "FireSaaS | Blog",
    description: "View blog posts teaching you how to build SaaS easier.",
  },
};

export default async function BlogPage() {
  const blogPosts = await getAllBlogPosts();

  if (!blogPosts) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-8">No blog posts found</h1>
        <Link href="/" className="btn btn-primary">
          Go back to the homepage
        </Link>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      <div className="grid gap-6">
        {blogPosts.map((post: any) => (
          <div key={post.sys.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {post.image && (
                <div className="flex flex-col items-center justify-center max-h-[300px] overflow-hidden mb-6">
                  <Image
                    src={`${post.image.url}`}
                    alt={post.title}
                    width={1200}
                    height={600}
                  />
                </div>
              )}
              <h2 className="card-title">{post.title}</h2>
              <span className="text-sm text-gray-500">{post.description}</span>
              <p className="text-sm text-gray-500">
                Published on{" "}
                {new Date(post.sys.firstPublishedAt).toLocaleDateString()}
              </p>
              <div className="card-actions justify-end">
                <Link href={`/blog/${post.slug}`} className="btn btn-primary">
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

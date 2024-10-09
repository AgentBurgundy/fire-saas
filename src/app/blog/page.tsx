import Link from "next/link";
import Image from "next/image";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const metadata = {
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

export default function BlogPage() {
  const postsDirectory = path.join(process.cwd(), "src/posts");
  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title || "",
      date: data.date || "",
      description: data.description || "",
      image: data.image || "",
    };
  });

  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      <div className="grid gap-6">
        {posts.map((post) => (
          <div key={post.slug} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {post.image && (
                <div className="flex flex-col items-center justify-center max-h-[300px] overflow-hidden mb-6">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={1200}
                    height={600}
                  />
                </div>
              )}
              <h2 className="card-title">{post.title}</h2>
              <span className="text-sm text-gray-500">{post.description}</span>
              <p className="text-sm text-gray-500">
                Published on {new Date(post.date).toLocaleDateString()}
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

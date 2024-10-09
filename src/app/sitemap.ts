import { getAllPosts } from "@/lib/blog/mdx";
import type { MetadataRoute } from "next";

const domain = "https://test.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    {
      url: domain,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
  ];

  if (process.env.NEXT_PUBLIC_ENABLE_BLOG === "true") {
    staticPages.push({
      url: `${domain}/blog`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    });

    const posts = await getAllPosts();

    staticPages.push(
      ...posts.map((post) => ({
        url: `https://compliance.dental/blog/${post.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7, // Added priority
      })),
    );
  }

  return staticPages;
}

import { contentfulClient } from "@/lib/contentful";
import type { MetadataRoute } from "next";

const domain = "https://test.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  async function getBlogPosts() {
    const response = await contentfulClient.getEntries<any>({
      content_type: "blog",
      order: ["-sys.createdAt"],
    });
    return response.items;
  }

  const blogPosts = await getBlogPosts();
  const blogPostUrls = blogPosts.map((post) => ({
    url: `${domain}/blog/${post.sys.id}`,
    lastModified: new Date(post.sys.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const staticPages = [
    {
      url: domain,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 1,
    },
    {
      url: `${domain}/blog`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  if (blogPostUrls.length > 0) {
    staticPages.push(...blogPostUrls);
  }

  return staticPages;
}

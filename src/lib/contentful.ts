import { createClient } from "contentful";

// This requires you setup contentful with a blog content type and these props
// title, slug, description, content, image
// Refer to the firesaas docs for more info

const BLOG_GRAPHQL_FIELDS = `
  sys {
    id
    firstPublishedAt
  }
  title
  slug
  description
  content
  image {
    url
  }
`;

export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

const fetchBlogPosts = (query: string) => {
  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query }),
      next: { tags: ["blog"] },
    },
  ).then((res) => res.json());
};

function extractBlogEntries(fetchResponse: any): any {
  return fetchResponse?.data?.blogCollection?.items;
}

export async function getAllBlogPosts(limit = 10): Promise<any[]> {
  const entries = await fetchBlogPosts(`query {
    blogPostCollection(limit: ${limit}) {
      items {
        ${BLOG_GRAPHQL_FIELDS}
      }
    }
  }`);
  return extractBlogEntries(entries);
}

export async function getBlogPostBySlug(slug: string): Promise<any> {
  const entries = await fetchBlogPosts(`query {
    blogPostCollection(where: {slug: "${slug}"}) {
      items {
        ${BLOG_GRAPHQL_FIELDS}
      }
    }
  }`);
  return extractBlogEntries(entries)[0];
}

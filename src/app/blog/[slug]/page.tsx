import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import BlogLayout from "@/components/blog/BlogLayout";

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "src/posts");
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => ({
    slug: fileName.replace(/\.mdx$/, ""),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const postsDirectory = path.join(process.cwd(), "src/posts");
  const fullPath = path.join(postsDirectory, `${params.slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data } = matter(fileContents);

  return {
    title: data.title || "",
    description: data.description || "",
    image: data.image || "/test.png",
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const postsDirectory = path.join(process.cwd(), "src/posts");
  const fullPath = path.join(postsDirectory, `${params.slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { content, data } = matter(fileContents);
  const frontMatter = {
    title: data.title || "",
    date: data.date || "",
    description: data.description || "",
    image: data.image || "/test.png", // Add a default image path
  };

  return (
    <BlogLayout frontMatter={frontMatter}>
      <MDXRemote source={content} />
    </BlogLayout>
  );
}

import {
  contentfulClient,
  getAllBlogPosts,
  getBlogPostBySlug,
} from "@/lib/contentful";
import { Metadata, ResolvingMetadata } from "next";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);

  return {
    title: post.fields.title,
    description: post.fields.description,
    metadataBase: new URL("https://firesaas.dev/blog"),
    openGraph: {
      images: [`https:${post.fields.image.fields.file.url}`],
      url: `https://firesaas.dev/blog/${post.fields.slug}`,
      siteName: "FireSaaS",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      images: [`https:${post.fields.image.fields.file.url}`],
      card: "summary_large_image",
      title: post.fields.title,
      description: post.fields.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  const components: Partial<Components> = {
    p: ({ children, ...props }: React.ComponentPropsWithoutRef<"p">) => (
      <p className="mb-8" {...props}>
        {children}
      </p>
    ),
    h1: ({ children, ...props }: React.ComponentPropsWithoutRef<"h1">) => (
      <h1 className="text-4xl font-bold mt-12 mb-6" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: React.ComponentPropsWithoutRef<"h2">) => (
      <h2 className="text-3xl font-semibold mt-10 mb-5" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: React.ComponentPropsWithoutRef<"h3">) => (
      <h3 className="text-2xl font-semibold mt-8 mb-4" {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }: React.ComponentPropsWithoutRef<"h4">) => (
      <h4 className="text-xl font-semibold mt-6 mb-3" {...props}>
        {children}
      </h4>
    ),
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <div className="mockup-code pl-4 mb-4">
          <pre>
            <code className={className} {...props}>
              {String(children).replace(/\n$/, "")}
            </code>
          </pre>
        </div>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    a: ({ children, href, ...props }: React.ComponentPropsWithoutRef<"a">) => (
      <a className="text-primary underline" href={href} {...props}>
        {children}
      </a>
    ),
  };

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col items-center justify-center max-h-[300px] overflow-hidden mb-6">
        <Image
          src={`${post.image.url}`}
          alt={post.title}
          width={1200}
          height={600}
          priority={true}
        />
      </div>

      {post.title && (
        <h1 className="text-3xl lg:text-5xl font-bold mb-4">{post.title}</h1>
      )}
      {post.sys.firstPublishedAt && (
        <p className="text-gray-500 mb-8">
          Published on{" "}
          {new Date(post.sys.firstPublishedAt).toLocaleDateString()}
        </p>
      )}
      {post.content && (
        <div className="prose lg:prose-xl max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {post.content}
          </ReactMarkdown>
        </div>
      )}
    </main>
  );
}

import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";

const CustomH1 = (props: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h1 className="text-4xl font-bold my-6" {...props} />
);

const CustomH2 = (props: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className="text-3xl font-semibold my-5" {...props} />
);

const CustomH3 = (props: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className="text-2xl font-medium my-4" {...props} />
);

const CustomP = (props: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className="my-3 text-base-content" {...props} />
);

const CustomUl = (props: React.HTMLAttributes<HTMLUListElement>) => (
  <ul className="list-disc list-inside my-4 space-y-2" {...props} />
);

const CustomOl = (props: React.HTMLAttributes<HTMLOListElement>) => (
  <ol className="list-decimal list-inside my-4 space-y-2" {...props} />
);

const CustomLi = (props: React.HTMLAttributes<HTMLLIElement>) => (
  <li className="text-base-content" {...props} />
);

const CustomBlockquote = (props: React.HTMLAttributes<HTMLQuoteElement>) => (
  <blockquote
    className="border-l-4 border-primary pl-4 italic my-4"
    {...props}
  />
);

const CustomA = (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <Link href={props.href || "#"} className="link link-primary" {...props} />
);

const CustomCode = (props: React.HTMLAttributes<HTMLElement>) => (
  <code className="bg-base-200 text-base-content rounded px-1" {...props} />
);

const CustomPre = (props: React.HTMLAttributes<HTMLPreElement>) => (
  <pre className="bg-base-200 rounded p-4 overflow-x-auto my-4" {...props} />
);

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: CustomH1,
    h2: CustomH2,
    h3: CustomH3,
    p: CustomP,
    ul: CustomUl,
    ol: CustomOl,
    li: CustomLi,
    blockquote: CustomBlockquote,
    a: CustomA,
    code: CustomCode,
    pre: CustomPre,
    img: ({ src, alt, ...props }) =>
      src ? (
        <Image
          src={src}
          alt={alt || ""}
          {...props}
          width={800}
          height={400}
          className="w-full h-auto rounded-lg my-4"
        />
      ) : null,
    ...components,
  };
}

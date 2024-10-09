"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface Post {
  slug: string;
  frontMatter: {
    title: string;
    date: string;
    description: string;
    image: string;
  };
}

interface BlogListProps {
  posts: Post[];
  postsPerPage?: number;
}

const BlogList: React.FC<BlogListProps> = ({ posts, postsPerPage = 9 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPosts.map((post) => (
          <div
            key={post.slug}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
          >
            <figure className="relative aspect-[16/9]">
              <Image
                src={post.frontMatter.image}
                alt={post.frontMatter.title}
                fill
                className="object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-lg">{post.frontMatter.title}</h2>
              <p className="text-sm text-base-content/70">
                {post.frontMatter.date}
              </p>
              <p className="text-sm mt-2">{post.frontMatter.description}</p>
              <div className="card-actions justify-end mt-4">
                <Link
                  href={`/blog/${post.slug}`}
                  className="btn btn-primary btn-sm"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="join">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`join-item btn ${
                  currentPage === i + 1 ? "btn-active" : ""
                }`}
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default BlogList;

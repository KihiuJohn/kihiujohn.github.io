'use client';

import React from 'react';

interface Post {
  title: string;
  excerpt: string;
  url: string;
}

const posts: Post[] = [
  {
    title: 'Troubleshooting HTTP Error 503',
    excerpt:
      'Learn how to diagnose and resolve the common HTTP 503 Service Unavailable error.',
    url: '#',
  },
  {
    title: 'Optimizing Automation Workflows',
    excerpt:
      'Best practices for streamlining your CI/CD pipelines and automation tasks.',
    url: '#',
  },
  {
    title: 'Deep Dive into Database Management',
    excerpt:
      'An in-depth look at organizing data and ensuring performance at scale.',
    url: '#',
  },
];

const Blog = () => {
  return (
    <section id="blog" className="section-padding">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical Blog</h2>
          <div className="h-1 w-20 bg-primary-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto">
            Sharing troubleshooting tips and deep dives to help you learn.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.title}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                {post.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
              <a
                href={post.url}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
              >
                Read more
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;

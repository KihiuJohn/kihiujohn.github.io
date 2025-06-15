import React from 'react';
import Link from 'next/link';

const posts = [
  {
    title: 'Troubleshooting HTTP Error 503',
    slug: 'troubleshooting-http-error-503',
    date: '2025-06-15',
    excerpt:
      'Learn how to diagnose and resolve HTTP 503 errors in production environments.',
  },
  {
    title: 'Optimizing Automation Workflows',
    slug: 'optimizing-automation-workflows',
    date: '2025-06-10',
    excerpt:
      'Tips and best practices for streamlining your CI/CD pipelines and automation scripts.',
  },
  {
    title: 'Deep Dive into Database Management',
    slug: 'deep-dive-into-database-management',
    date: '2025-06-05',
    excerpt:
      'Understanding indexing, backups, and performance tuning for modern databases.',
  },
];

export const metadata = {
  title: 'Technical Blog | John Kihiu',
  description: 'Technical articles on web development and infrastructure.',
};

const Blog = () => (
  <main className="section-padding">
    <div className="container mx-auto px-4 md:px-6 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Technical Blog</h1>
      <ul className="space-y-6">
        {posts.map((post) => (
          <li key={post.slug} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h2 className="text-2xl font-semibold mb-1">
              <Link href="#" className="hover:text-primary-600">
                {post.title}
              </Link>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{post.date}</p>
            <p className="text-gray-700 dark:text-gray-300">{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  </main>
);

export default Blog;

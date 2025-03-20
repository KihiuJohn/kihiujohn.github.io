'use client';

import React from 'react';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 z-0"></div>

      {/* Decorative circles */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary-300/20 dark:bg-primary-900/20 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-300/20 dark:bg-purple-900/20 rounded-full filter blur-3xl"></div>

      <div className="container mx-auto px-4 md:px-6 z-10">
        <div className="text-center space-y-8 animate-slide-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Hi, I'm <span className="hero-text-gradient">John Kihiu</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A passionate Full Stack Developer specializing in building
            exceptional digital experiences with modern technologies.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#projects"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium transition-colors focus-ring"
            >
              View My Work
            </Link>

            <Link
              href="#contact"
              className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 px-6 py-3 rounded-md font-medium transition-colors focus-ring"
            >
              Contact Me
            </Link>
          </div>

          <div className="flex justify-center pt-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 animate-bounce-slow text-gray-400"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

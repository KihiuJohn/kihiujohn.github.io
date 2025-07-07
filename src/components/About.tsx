'use client';

import React from 'react';
import './Card.css'; // Keep this import as other components might use it, though it's not directly needed for this component after card removal.

const About = () => {
  return (
    <section id="about" className="section-padding bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        {/* ---------- Heading ---------- */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">About Me</h2>
          <div className="h-1 w-20 bg-primary-600 mx-auto rounded-full" />
        </div>

        {/*
          Removed the grid layout as there's only one main content column now.
          Using flexbox to center the content horizontally.
        */}
        <div className="flex justify-center">
          {/* ---------- Left Column (now centered) ---------- */}
          {/*
            Setting a max-width to prevent the text from becoming too wide on large screens,
            while allowing it to be responsive.
            The 'mx-auto' ensures the block itself is centered within the flex container.
          */}
          <div className="space-y-6 max-w-2xl text-center md:text-left">
            <h3 className="text-2xl font-semibold text-white">
              I&apos;m <span className="text-primary-600">John Kihiu</span>, a passionate Full-Stack Developer
            </h3>

            <p className="text-gray-300 leading-relaxed">
              I specialize in building modern, high-performance web applications using cutting-edge
              technologies. With a strong foundation in both frontend and backend development, I create
              seamless digital experiences that are both beautiful and functional.
            </p>

            <p className="text-gray-300 leading-relaxed">
              My expertise spans Laravel, React, Tailwind CSS, Alpine.js, Livewire, and more.
              I&apos;m passionate about writing clean, maintainable code and constantly exploring new
              technologies to enhance my skill set.
            </p>

            <div className="pt-4">
              <h4 className="font-medium text-lg mb-3 text-white">Connect with me:</h4>
              {/*
                For social icons, ensure they are centered when the text is centered.
                Using 'justify-center' for the flex container here.
              */}
              <div className="flex space-x-4 justify-center md:justify-start">
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/john-kihiu-3481b8232/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-gray-300 hover:text-primary-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136
                              1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9
                              1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267
                              5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065
                              0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925
                              2.064 2.063 0 1.139-.925 2.065-2.064
                              2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/_migett/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-gray-300 hover:text-primary-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd"
                              d="M12.315 2c2.43 0 2.784.013 3.808.06
                              1.064.049 1.791.218 2.427.465a4.902 4.902 0
                              011.772 1.153 4.902 4.902 0 011.153
                              1.772c.247.636.416 1.363.465
                              2.427.048 1.067.06 1.407.06 4.123v.08c0
                              2.643-.012 2.987-.06 4.043-.049
                              1.064-.218 1.791-.465 2.427a4.902 4.902 0
                              01-1.153 1.772 4.902 4.902 0
                              01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0
                              01-1.772-1.153 4.902 4.902 0
                              01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0
                              011.153-1.772A4.902 4.902 0
                              015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901
                              2.013 9.256 2 11.685 2h.63zM12
                              6.865a5.135 5.135 0 110 10.27 5.135 5.135 0
                              010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333
                              3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110
                              2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>

                {/* Email */}
                <a
                  href="mailto:Kihiujohn12@gmail.com"
                  aria-label="Email"
                  className="text-gray-300 hover:text-primary-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21
                              8M5 19h14a2 2 0 002-2V7a2 2 0
                              00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

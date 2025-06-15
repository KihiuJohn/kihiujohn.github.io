'use client';

import React from 'react';
import './Card.css';               // <-- make sure Card.css sits in the same folder or adjust the path

const About = () => {
  return (
    <section id="about" className="section-padding bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        {/* ---------- Heading ---------- */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">About Me</h2>
          <div className="h-1 w-20 bg-primary-600 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* ---------- Left Column ---------- */}
          <div className="space-y-6">
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
              <div className="flex space-x-4">
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

          {/* ---------- Right Column (3-D Card) ---------- */}
          <div className="flex justify-center md:justify-end">
            {/* 3-D card from uiverse.io */}
            <div className="parent">
              <div className="card">
                {/* Decorative logo circles */}
                <div className="logo">
                  <span className="circle circle1" />
                  <span className="circle circle2" />
                  <span className="circle circle3" />
                  <span className="circle circle4" />
                  <span className="circle circle5">
                    <svg viewBox="0 0 29.667 31.69" className="svg" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.827 1.628A1.561 1.561 0 0 1 14.31 0h2.964a1.561 1.561 0 0 1 1.483
                               1.628v11.9a9.252 9.252 0 0 1-2.432 6.852q-2.432 2.409-6.963
                               2.409T2.4 20.452Q0 18.094 0 13.669V1.628A1.561 1.561 0 0 1
                               1.483 0h2.98A1.561 1.561 0 0 1 5.947
                               1.628V13.191a5.635 5.635 0 0 0 .85 3.451 3.153 3.153 0 0 0
                               2.632 1.094 3.032 3.032 0 0 0 2.582-1.076 5.836 5.836 0 0 0
                               .816-3.486Z" />
                      <path d="M75.207 20.857a1.561 1.561 0 0 1-1.483
                               1.628h-2.98a1.561 1.561 0 0 1-1.483-1.628V1.628A1.561
                               1.561 0 0 1 70.743 0h2.98a1.561 1.561 0 0 1 1.483
                               1.628Z" transform="translate(-45.91 0)" />
                      <path d="M0 80.018A1.561 1.561 0 0 1
                               1.483 78.39h26.7a1.561 1.561 0 0 1 1.483
                               1.628v2.006a1.561 1.561 0 0 1-1.483
                               1.628H1.483A1.561 1.561 0 0 1 0 82.025Z"
                            transform="translate(0 -51.963)" />
                    </svg>
                  </span>
                </div>

                <div className="glass" />

                {/* Card content */}
                <div className="content">
                  <span className="title">UIVERSE (3-D UI)</span>
                  <span className="text">
                    Create, share, and use beautiful custom elements made with CSS
                  </span>
                </div>

                {/* Bottom section */}
                <div className="bottom">
                  <div className="social-buttons-container">
                    <button className="social-button">
                      <svg viewBox="0 0 30 30" className="svg">
                        <path d="M9.998 3C6.139 3 3 6.142 3 10v10c0 3.86
                                 3.142 7 6.998 7h10c3.86 0 7-3.142
                                 7-7V10c0-3.861-3.142-7-7-7H9.998zm12.002
                                 4a1 1 0 110 2 1 1 0 010-2zM15 9a6 6 0
                                 110 12 6 6 0 010-12zm0 2a4 4 0 100
                                 8 4 4 0 000-8z" />
                      </svg>
                    </button>

                    <button className="social-button">
                      <svg viewBox="0 0 512 512" className="svg">
                        <path d="M459.37 151.716c.325 4.548.325
                                 9.097.325 13.645 0 138.72-105.583
                                 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106
                                 8.447.974 16.568 1.299 25.34 1.299 49.055 0
                                 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772
                                 6.498.974 12.995 1.624 19.818 1.624
                                 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299
                                 c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391
                                 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675
                                 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04
                                 0-57.828 46.782-104.934 104.934-104.934 30.213 0
                                 57.502 12.67 76.67 33.137 23.715-4.548
                                 46.456-13.32 66.599-25.34-7.798 24.366-24.366
                                 44.833-46.132 57.827 21.117-2.273 41.584-8.122
                                 60.426-16.243-14.292 20.791-32.161
                                 39.308-52.628 54.253z" />
                      </svg>
                    </button>

                    <button className="social-button">
                      <svg viewBox="0 0 640 512" className="svg">
                        <path d="M524.531 69.836a1.5 1.5 0 0 0-.764-.7
                                 A485.065 485.065 0 0 0 404.081
                                 32.03a1.816 1.816 0 0 0-1.923.91
                                 337.461 337.461 0 0 0-14.9 30.6
                                 447.848 447.848 0 0 0-134.426 0
                                 309.541 309.541 0 0 0-15.135-30.6
                                 1.89 1.89 0 0 0-1.924-.91
                                 A483.689 483.689 0 0 0 116.085
                                 69.137a1.712 1.712 0 0 0-.788.676C39.068
                                 183.651 18.186 294.69 28.43
                                 404.354a2.016 2.016 0 0 0 .765 1.375
                                 A487.666 487.666 0 0 0 176.02
                                 479.918a1.9 1.9 0 0 0 2.063-.676
                                 348.2 348.2 0 0 0 30.037-48.842
                                 1.86 1.86 0 0 0-1.019-2.588
                                 321.173 321.173 0 0 1-45.868-21.853
                                 1.885 1.885 0 0 1-.185-3.126
                                 c3.082-2.309 6.166-4.711 9.109-7.137
                                 a1.819 1.819 0 0 1 1.9-.256
                                 c96.229 43.917 200.41 43.917 295.5 0a1.812
                                 1.812 0 0 1 1.924.233c2.944 2.426
                                 6.027 4.851 9.132 7.16a1.884 1.884 0 0 1-.162
                                 3.126 301.407 301.407 0 0 1-45.89
                                 21.83 1.875 1.875 0 0 0-1
                                 2.611 391.055 391.055 0 0 0
                                 30.014 48.815 1.864 1.864 0 0 0
                                 2.063.7A486.048 486.048 0 0 0
                                 610.7 405.729a1.882 1.882 0 0 0
                                 .765-1.352C623.729 277.594 590.933
                                 167.465 524.531 69.836ZM222.491
                                 337.58c-28.972 0-52.844-26.587-52.844-59.239S193.056
                                 219.1 222.491 219.1c29.665 0 53.306
                                 26.82 52.843 59.239 0 32.652-23.41
                                 59.239-52.843 59.239zm195.38 0c-28.971
                                 0-52.843-26.587-52.843-59.239S388.437
                                 219.1 417.871 219.1c29.667 0 53.307
                                 26.82 52.844 59.239 0 32.652-23.177
                                 59.239-52.844 59.239z" />
                      </svg>
                    </button>
                  </div>

                  <div className="view-more">
                    <button className="view-more-button">View more</button>
                    <svg viewBox="0 0 24 24" className="svg">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ---------- End of Right Column ---------- */}
        </div>
      </div>
    </section>
  );
};

export default About;

'use client';

import React, { useState } from 'react';

const items = [
  'Responsive Websites',
  'E-commerce Platforms',
  'Landing Pages',
  'Portfolio Sites',
  'Web Applications',
];

const Chatbot = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-72 p-4 mb-2 animate-fade-in">
          <p className="font-medium mb-2">How can I help you?</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Here are some things I can build for your website:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-200">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="bg-primary-600 hover:bg-primary-700 text-white rounded-full p-3 focus-ring"
        aria-label="Toggle Chatbot"
      >
        {open ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default Chatbot;

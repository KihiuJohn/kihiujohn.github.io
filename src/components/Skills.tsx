'use client';

import React from 'react';
import Image from 'next/image';

interface SkillProps {
  name: string;
  iconUrl: string;
}

const Skill: React.FC<SkillProps> = ({ name, iconUrl }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all group">
      <div className="w-16 h-16 relative mb-3 group-hover:scale-110 transition-transform duration-300">
        <Image
          src={iconUrl}
          alt={`${name} icon`}
          width={64}
          height={64}
          className="object-contain"
        />
      </div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{name}</span>
    </div>
  );
};

const Skills = () => {
  const skills = [
    {
      name: 'Tailwind CSS',
      iconUrl: 'https://icon.icepanel.io/Technology/svg/Tailwind-CSS.svg',
    },
    {
      name: 'Alpine.js',
      iconUrl: 'https://icon.icepanel.io/Technology/svg/Alpine.js.svg',
    },
    {
      name: 'Laravel',
      iconUrl: 'https://icon.icepanel.io/Technology/svg/Laravel.svg',
    },
    {
      name: 'Livewire',
      iconUrl: 'https://icon.icepanel.io/Technology/svg/Livewire.svg',
    },
    {
      name: 'React',
      iconUrl: 'https://icon.icepanel.io/Technology/svg/React.svg',
    },
    {
      name: 'PHP',
      iconUrl: 'https://icon.icepanel.io/Technology/svg/PHP.svg',
    },
    {
      name: '.NET',
      iconUrl: 'https://icon.icepanel.io/Technology/svg/.NET.svg',
    },
    {
      name: 'C#',
      iconUrl: 'https://icon.icepanel.io/Technology/svg/C%23-%28CSharp%29.svg',
    },
    {
      name: 'Python',
      iconUrl: 'https://icon.icepanel.io/Technology/svg/Python.svg',
    },
    {
      name: 'JavaScript',
      iconUrl: 'https://icon.icepanel.io/Technology/svg/JavaScript.svg',
    },
    {
      name: 'Git',
      iconUrl: 'https://icon.icepanel.io/Technology/svg/Git.svg',
    },
    {
      name: 'Postman',
      iconUrl: 'https://icon.icepanel.io/Technology/svg/Postman.svg',
    },
  ];

  return (
    <section id="skills" className="section-padding bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills & Technologies</h2>
          <div className="h-1 w-20 bg-primary-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto">
            I've worked with a range of technologies in the web development world, from backend to frontend.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {skills.map((skill) => (
            <Skill key={skill.name} name={skill.name} iconUrl={skill.iconUrl} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';

export const Projects = () => {
  const projects = [
    {
      title: 'Blog',
      description:
        'A blog website that I started in 2021. I write about my experiences and thoughts on software development, productivity, and life. I also intend to share tutorials on the blog some day.',
      image: '/blog.gif',
      link: 'https://marnoux-blog.vercel.app/',
      repo: 'https://github.com/marnoux/blog',
    },
    {
      title: 'Dutch Art Viewer',
      description:
        'A simple web app that fetches data from the Rijksmuseum API and displays it in a gallery. I built this project to practice working with APIs and to learn more about React. This app is responsive and uses Tailwind CSS for styling. I also implemented infinite scrolling to load more images when the user reaches the bottom of the page.',
      image: '/art.gif',
      link: 'https://art-viewer-xi.vercel.app/',
      repo: 'https://github.com/marnoux/art-viewer',
    },
    {
      title: 'Health Tracker',
      description:
        'A health tracker app that I built to practice working with React and Redux. The app allows users to track their daily water intake and exercise. I also implemented a calendar to display the user’s data and a chart to visualize their progress. This project helped me learn more about state management and data visualization in React.',
      image: '/health-tracker.gif',
      link: 'https://health-tracker-henna.vercel.app/',
      repo: 'https://github.com/marnoux/health-tracker',
    },
  ];

  return (
    <div className="relative z-0 mx-auto flex h-screen max-w-full flex-col items-center justify-evenly overflow-hidden text-left md:flex-row ">
      <h3 className="absolute top-24 text-2xl uppercase text-center tracking-[20px] text-gray-500">
        Projects
      </h3>

      <div className="relative z-20 flex snap-x snap-mandatory overflow-x-scroll scrollbar overflow-y-hidden scrollbar-track-gray-400/20 scrollbar-thumb-[#36b2ed]">
        {projects.map((project, i) => (
          <div
            key={i}
            className="p20 m:p-44 flex h-screen w-screen flex-shrink-0 snap-center flex-col content-center items-center justify-center space-y-5"
          >
            <motion.div
              initial={{ y: -300, opacity: 0 }}
              transition={{ duration: 1.2 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Image
                className="rounded-lg border border-[#36b2ed] object-cover"
                alt={i.toString()}
                src={project.image}
                height={1920}
                width={1080}
              />
            </motion.div>

            <div>
              <h4 className="text-4xl font-semibold text-center">
                <span className="underline decoration-[#36b2ed]/40">
                  {i + 1} of {projects.length}:
                </span>{' '}
                <a>{project.title}</a>
              </h4>
              <h5 className="text-3xl font-semibold text-center underline mt-5 text-[#36b2ed]">
                <a className="animate-pulse" href={project.repo} target="_blank" rel="noreferrer">
                  Code
                </a>
                {' | '}
                <a className="animate-pulse" href={project.link} target="_blank" rel="noreferrer">
                  Site
                </a>
              </h5>
              <p className="text-lg text-center md:text-left p-10 max-w-4xl">
                {project.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute top-[30%] left-0 h-[500px] w-full -skew-y-12 bg-[#36b2ed]/5" />
    </div>
  );
};

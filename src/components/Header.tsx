import { motion } from 'framer-motion';
import Link from 'next/link';
import { SocialIcon } from 'react-social-icons';

export const Header = () => {
  const socialLinks = [
    'https://github.com/marnoux',
    'https://instagram.com/marnouxm',
    'https://linkedin.com/in/marnouxm',
    'https://twitter.com/MarnouxM',
    'https://youtube.com/@marnoux',
  ];

  return (
    <header className="sticky top-0 p-5 flex items-start justify-between max-w-7xl mx-auto z-20 xl:items-center">
      <motion.div
        initial={{
          x: -500,
          opacity: 0,
          scale: 0.5,
        }}
        animate={{
          x: 0,
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 1.5,
        }}
        className="flex flex-row items-center"
      >
        {/* Social Icons */}
        {socialLinks.map((link) => (
          <SocialIcon key={link} bgColor="transparent" fgColor="gray" url={link} target="_blank" />
        ))}
      </motion.div>

      <motion.div
        className="flex flex-row items-start justify-start content-start text-gray-300 cursor-pointer"
        initial={{
          x: 500,
          opacity: 0,
          scale: 0.5,
        }}
        animate={{
          x: 0,
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 1.5,
        }}
      >
        <div
          onClick={() => (window.location.href = '#contact')}
          className="border border-[#242424] rounded-full uppercase text-xs tracking-widest text-gray-500 transition-all hover:border-[#36b2ed] focus:text-[#36b2ed]"
        >
          <SocialIcon
            className="cursor-pointer"
            network="email"
            fgColor="gray"
            bgColor="transparent"
          />
          <span className="uppercase hidden md:inline-flex text-sm text-gray-400 mr-5">
            Get in touch
          </span>
        </div>
      </motion.div>
    </header>
  );
};

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SocialIcon } from 'react-social-icons';
import { FaFileDownload } from 'react-icons/fa';

export const Header = () => {
  const socialLinks = [
    'https://linkedin.com/in/marnouxm',
    'https://github.com/marnoux',
    'https://instagram.com/marnouxm',
    'https://twitter.com/MarnouxM',
    'https://marnoux-blog.vercel.app/',
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
        className="flex flex-row items-center justify-start content-start text-gray-300 cursor-pointer"
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
        <a
          href="https://drive.google.com/file/d/1xYZzrHqKLR5mlolN1zyMDMLf4qzQv2U3/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center gap-2 border border-[#242424] rounded-full uppercase text-xs tracking-widest text-gray-500 transition-all hover:border-[#36b2ed] focus:text-[#36b2ed] p-4"
        >
          <FaFileDownload className="cursor-pointer" size={20} />

          <span className="uppercase hidden md:inline-flex text-sm text-gray-400 mr-5">
            Download CV
          </span>
        </a>
        <div
          onClick={() => (window.location.href = '#contact')}
          className="flex justify-center items-center border border-[#242424] rounded-full uppercase text-xs tracking-widest text-gray-500 transition-all hover:border-[#36b2ed] focus:text-[#36b2ed]"
        >
          <SocialIcon
            className="p-0 m-0 cursor-pointer"
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

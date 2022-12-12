import { formatDistance } from 'date-fns';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

export const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="h-screen flex flex-col relative text-center md:text-left md:flex-row max-w-7xl px-10 justify-evenly mx-auto items-center"
    >
      <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-500 text-2xl ">About</h3>

      <motion.div
        initial={{
          x: -200,
        }}
        transition={{
          duration: 1.75,
        }}
        whileInView={{
          opacity: 1,
          x: 0,
        }}
        className="flex-shrink-0"
        viewport={{ once: true }}
      >
        <Image
          alt="Gif of developer coding"
          className="mt-80 mb-20 md:mb-0 sm:mb-20 sm:mt-60 md:mt-0  w-56 h-56 rounded-full object-cover md:rounded-lg md:w-56 md:h95 xl:w-[500px] xl:h-[600px] "
          src="/developer.gif"
          height={480}
          width={360}
        />
      </motion.div>

      <div className="mb-20 mt-0 space-y-20 px-0 md:px-10">
        <h4 className="text-4xl font-semibold">
          Here is a <span className="underline decoration-[#36b2ed]">little</span> background
        </h4>
        <p className="text-base">
          I am a Front-end engineer with {formatDistance(new Date(), new Date('2016-01-01'))}
          experience in the field of web development. I have worked in multiple industries including
          marketing, financial, online gaming &amp; medical. I have a wealth of experience
          developing and maintaining web based UIs with a rich user experience and a powerful
          backend. I continue to hone my skills as a developer by working on exciting projects as
          well as staying abreast with industry standards by completing cutting edge courses. I make
          sure to find enjoyment in everything that I spend my time on, which in turn helps me to
          always do my best in all that I pursue. I strive to always move forward.
        </p>
      </div>
    </motion.div>
  );
};

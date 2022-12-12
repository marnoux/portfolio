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
      className="relative mx-auto mb-20 flex h-screen max-w-7xl flex-col items-center justify-evenly px-10 text-center md:flex-row md:text-left"
    >
      <h3 className="absolute top-24 text-2xl uppercase tracking-[20px] text-gray-500 sm:px-20">
        About
      </h3>

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
          className="md:h95 mt-80 mb-20 h-56 w-56 rounded-full object-cover sm:mb-20 sm:mt-60 md:mb-0 md:mt-0 md:w-56 md:rounded-lg xl:h-[400px] xl:w-[400px] "
          src="/developer.gif"
          height={480}
          width={360}
        />
      </motion.div>

      <div className="mb-20 mt-0 space-y-20 px-0 md:px-10">
        <h4 className="text-4xl font-semibold">
          Here is a <span className="underline decoration-[#36b2ed]">little</span> background
        </h4>
        <div className="text-base">
          <div className="mb-4">
            I am a Front-end engineer with {formatDistance(new Date(), new Date('2016-01-01'))}{' '}
            experience in the field of web development.
          </div>
          <div className="mb-4">
            I have worked in multiple industries including marketing, financial, online gaming &amp;
            medical, through this I have built up a wealth of experience developing and maintaining
            web based UIs with a rich user experience and a powerful backend.
          </div>
          <div className="mb-4">
            I continue to hone my skills as a developer by working on exciting projects as well as
            staying abreast with industry standards by completing cutting edge courses.
          </div>
          <div className="mb-4">
            I make sure to find enjoyment in everything that I spend my time on, which in turn helps
            me to always do my best in all that I pursue. I strive to always move forward.
          </div>
        </div>
      </div>
    </motion.div>
  );
};

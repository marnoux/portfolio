import { motion } from 'framer-motion';
import React from 'react';

export const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="flex flex-col relative h-screen text-center md:text-left md:flex-row max-w-7xl px-10 justify-evenly mx-auto items-center"
    >
      <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-500 text-2xl">About</h3>
      <br />
      <br />
      <motion.img
        initial={{
          x: -200,
        }}
        transition={{
          duration: 1.2,
        }}
        whileInView={{
          opacity: 1,
          x: 0,
        }}
        viewport={{ once: true }}
        src="https://marnoux.github.io/assets/img/hero-bg%20blur.jpg"
        className="mb-20 md:mb-0 sm:mb-200 flex-shrink-0 w-56 h-56 rounded-full object-cover md:rounded-lg md:w-56 md:h95 xl:w-[500px] xl:h-[600px]"
      />
      <div className="space-y-10 px-0 md:px-10">
        <h4 className="text-4xl font-semibold">
          Here is a <span className="underline decoration-[#F7AB0A]">little</span> background
        </h4>
        <p className="text-sm">
          I am a Front-end web developer with over 6 years experience in the field of web
          development. I have worked in multiple industries including marketing, financial, online
          gaming &amp; medical.
          <br />
          <br />
          I have a wealth of experience developing and maintaining web based UIs with a rich user
          experience and a powerful backend. I continue to hone my skills as a developer.
          <br />
          <br />
          I am always working on exciting projects as well as staying abreast with industry
          standards by completing cutting edge courses.
          <br />
          <br />I make sure to find enjoyment in everything that I spend my time on, which in turn
          helps me to always do my best in all that I pursue. I strive to always move forwards.
        </p>
      </div>
    </motion.div>
  );
};

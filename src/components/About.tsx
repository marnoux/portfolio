import { motion } from 'framer-motion';
import React from 'react';
import { useExperience } from '../data/hooks';

export const About = () => {
  const experience = useExperience();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="h-screen flex flex-col relative text-center md:text-left md:flex-row max-w-7xl px-10 justify-evenly mx-auto items-center"
    >
      <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-500 text-2xl ">About</h3>

      <motion.img
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
        viewport={{ once: true }}
        src="https://media1.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif?cid=ecf05e47oq2chp9mgp9q6cfqy1oktqekhp6d3utv1tvbrdfx&rid=giphy.gif&ct=g"
        className="mt-80 mb-20 md:mb-0 sm:mb-20 sm:mt-60 md:mt-0 flex-shrink-0 w-56 h-56 rounded-full object-cover md:rounded-lg md:w-56 md:h95 xl:w-[500px] xl:h-[600px] "
      />

      <div className="mb-20 mt-0 space-y-20 px-0 md:px-10">
        <h4 className="text-4xl font-semibold">
          Here is a <span className="underline decoration-[#F7AB0A]">little</span> background
        </h4>
        <p className="text-base">
          <div>
            I am a Front-end engineer with {experience} years experience in the field of web
            development.
          </div>
          <div>
            I have worked in multiple industries including marketing, financial, online gaming &amp;
            medical.
          </div>
          <div>
            I have a wealth of experience developing and maintaining web based UIs with a rich user
            experience and a powerful backend.
          </div>
          <div>
            I continue to hone my skills as a developer by working on exciting projects as well as
            staying abreast with industry standards by completing cutting edge courses.
          </div>
          <div>
            I make sure to find enjoyment in everything that I spend my time on, which in turn helps
            me to always do my best in all that I pursue.
          </div>
          <div>I strive to always move forwards.</div>
        </p>
      </div>
    </motion.div>
  );
};

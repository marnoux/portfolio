import { formatDistance } from 'date-fns';
import { motion } from 'framer-motion';
import Image from 'next/image';

export const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="flex flex-col relative h-screen text-center md:text-left md:flex-row max-w-7xl px-10 justify-evenly mx-auto items-center"
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
        className="flex-shrink-0 sm:mt-[20vh] sm:mb-[2vh]"
        viewport={{ once: true }}
      >
        <Image
          alt="Gif of developer coding"
          className="w-56 h-56 mt-[24vh] md:mt-[-10vh] rounded-full object-cover md:rounded-lg md:w-64 md:h-64 xl:w-72 xl:h-72"
          src="/developer.gif"
          height={480}
          width={360}
        />
      </motion.div>

      <div className="space-y-10 w-screen px-0 md:px-10 relative z-20 mt-4 md:mt-20 lg:mt-20 flex snap-x snap-mandatory overflow-y-scroll overflow-x-hidden scrollbar scrollbar-track-gray-400/20 scrollbar-thumb-[#37c0ff74] md:overflow-y-hidden">
        <div className="text-base space-y-4 border-solid shadow-sm text-ellipsis">
          <div>
            I am a Front-end engineer with{' '}
            {formatDistance(new Date(), new Date('2016-01-01'), { addSuffix: false })} professional
            experience in web development.
          </div>
          <div>
            I have worked in multiple industries including marketing, financial, online gaming and
            the medical field.
          </div>
          <div>
            I have a wealth of experience in developing and maintaining web based UIs with a rich
            user experience and a powerful backend.
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
        </div>
      </div>
    </motion.div>
  );
};

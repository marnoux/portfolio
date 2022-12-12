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
        className="md:flex-shrink-0 mt-[10rem] md:mt-0 mb-[10vh]"
        viewport={{ once: true }}
      >
        <Image
          alt="Gif of developer coding"
          className="w-56 h-56 rounded-full object-cover md:rounded-lg md:w-64 md:h-64 xl:w-72 xl:h-72"
          src={'/developer.gif'}
          height={480}
          width={360}
        />
      </motion.div>

      <div className={`space-y-10 px-0 mt-[-10vh] md:px-10`}>
        <div className="text-base">
          <div className="md:mb-4">
            I am a Front-end engineer with {formatDistance(new Date(), new Date('2016-01-01'))}{' '}
            experience in the field of web development.
          </div>
          <div className="md:mb-4">
            I have worked in multiple industries including marketing, financial, online gaming &amp;
            medical, through this I have built up a wealth of experience developing and maintaining
            UIs with a rich user experience and a powerful backend.
          </div>
          <div className="md:mb-4">I strive to always move forward.</div>
        </div>
      </div>
    </motion.div>
  );
};

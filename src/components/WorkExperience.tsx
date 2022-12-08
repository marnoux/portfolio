import { motion } from 'framer-motion';
import { ExperienceCard } from './ExperienceCard';

export const WorkExperience = () => {
  return (
    <div className="h-screen flex relative overflow-hidden flex-col text-left md:flew-row max-w-full px-10 justify-evenly mx-auto items-center mt-20">
      <h3 className="top-24 uppercase tracking-[20px] text-gray-500 text-2xl">Experience</h3>

      <motion.div className="w-full flex space-x-5 overflow-x-scroll p-10 snap-x snap-mandatory">
        <ExperienceCard />
        <ExperienceCard />
        <ExperienceCard />
        <ExperienceCard />
      </motion.div>
    </div>
  );
};

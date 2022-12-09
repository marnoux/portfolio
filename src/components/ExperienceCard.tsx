import { motion } from 'framer-motion';
import Image from 'next/image';

export const ExperienceCard = () => {
  return (
    <article className="flex flex-col rounded-lg items-center space-y-7 flex-shrink-0 w-[500px] md:w-[600px] xl:w-[900px] snap-center bg-[#292929] p-10 cursor-pointer transition-opacity duration-200 overflow-hidden">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        transition={{ duration: 1.5 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="rounded-full xl:w-[200px] xl:h-[200px] object-cover object-center"
      >
        <Image
          alt="heroImg"
          className="relative rounded-full w-32 h-32 object-cover"
          height={320}
          width={320}
          src="/../public/assets/icons/tech/react.png"
        />
      </motion.div>

      <div className="px-0 md:px-10 ">
        <h4 className="text-4xl font-light">Senior Frontend Engineer</h4>

        <p className="font-bold text-2xl mt-1">Castor</p>

        <div className="flex space-x-2 my-2">
          <Image
            alt="heroImg"
            className="h-10 w-10 rounded-full"
            height={100}
            width={100}
            src="/../public/assets/icons/tech/react.png"
          />
        </div>

        <p className="uppercase py-5 text-gray-300">Started work... - Ended...</p>

        <ul className="list-disc space-y-4 ml-5 text-lg">
          <li>Summary Points</li>
          <li>Summary Points</li>
          <li>Summary Points</li>
          <li>Summary Points</li>
          <li>Summary Points</li>
          <li>Summary Points</li>
        </ul>
      </div>
    </article>
  );
};

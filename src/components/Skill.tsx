import { motion } from 'framer-motion';
import Image from 'next/image';

type Props = {
  directionLeft?: boolean;
};

export const Skill = ({ directionLeft }: Props) => {
  return (
    <motion.div
      initial={{ x: directionLeft ? -200 : 200, opacity: 0 }}
      transition={{ duration: 1.5 }}
      whileInView={{ opacity: 1, x: 0 }}
      className="group relative flex cursor-pointer"
    >
      <Image
        alt="heroImg"
        className="rounded-full border border-gray-500 object-cover h-24 w-24 xl:w-32 xl:h-32 filter group-hover:grayscale transition duration-300 ease-in-out"
        height={320}
        width={320}
        src="https://marnoux.github.io/assets/img/react.png"
      />

      <div className="absolute opacity-0 group-hover:opacity-80 transition duration-300 ease-in-out group-hover:bg-white h-24 w-24 xl:h-32 xl:w-32 rounded-full z-0">
        <div className="flex items-center justify-center h-full">
          <p className="text-3xl font-bold text-black opacity-100">100%</p>
        </div>
      </div>
    </motion.div>
  );
};

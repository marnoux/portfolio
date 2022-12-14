// import { motion } from 'framer-motion';
import Image from 'next/image';

type Props = {
  level: number;
  name: string;
  src: string;
  directionLeft?: boolean;
};

export const Skill = ({ directionLeft, level, name, src }: Props) => {
  return (
    <div
      // initial={{ x: directionLeft ? -200 : 200, opacity: 0 }}
      // transition={{ duration: 1.5 }}
      // whileInView={{ opacity: 1, x: 0 }}
      className="group relative flex cursor-pointer px-2"
    >
      <Image
        alt="heroImg"
        className="object-cover h-20 w-20 xl:w-32 xl:h-32 filter group-hover:grayscale transition duration-300 ease-in-out"
        height={128}
        width={128}
        src={src}
      />

      <div className="absolute opacity-0 group-hover:opacity-80 transition duration-300 ease-in-out group-hover:bg-white h-20 w-20 xl:h-32 xl:w-32 z-0">
        <div className="flex flex-row items-center justify-center text-center h-full">
          <p className="text font-bold text-black opacity-100">
            {`${level}%`}
            <br />
            {`${name.charAt(0).toUpperCase()}${name.slice(1)}`}
          </p>
        </div>
      </div>
    </div>
  );
};

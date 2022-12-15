import { format } from 'date-fns';
import { motion } from 'framer-motion';
import _ from 'lodash';
import Image from 'next/image';

type ExperienceCardProps = {
  fileName: string;
  role: string;
  link: string;
  path: string;
  extension: string;
  companyName: string;
  techUsed: string[];
  startDate: string;
  endDate: string;
  points: string[];
};

export const ExperienceCard = ({
  fileName,
  role,
  link,
  companyName,
  path,
  extension,
  techUsed,
  startDate,
  endDate,
  points,
}: ExperienceCardProps) => {
  return (
    <article className="flex flex-col rounded-lg items-center space-y-7 flex-shrink-0 w-[90vw] md:w-[600px] xl:w-[900px] snap-center bg-[#363636] p-10 cursor-pointer transition-opacity duration-200 overflow-hidden">
      <motion.a
        href={link}
        target="_blank"
        initial={{ y: -100, opacity: 0 }}
        transition={{ duration: 1.5 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="rounded-full xl:w-[200px] xl:h-[200px] object-cover object-center"
      >
        <Image
          alt="Experience Card Company Image"
          className="relative rounded-full w-24 h-24 md:w-32 md:h-32 object-cover"
          height={320}
          width={320}
          src={`${path}${fileName}${extension}`}
        />
      </motion.a>

      <div className="scrollMask px-0 md:px-10 space-y-5 overflow-y-scroll overflow-x-hidden">
        <a href={link} target="_blank" className="font-bold text-2xl mt-1 text" rel="noreferrer">
          {companyName}
        </a>
        <h4 className="text-xl font-light">{role}</h4>

        <div className="flex flex-row mx-auto space-x-1 sm:space-x-3 w-80vw">
          {techUsed.map((item) => (
            <Image
              key={item}
              alt="Work experience skill image"
              className="h-10 w-10 rounded-full"
              height={100}
              width={100}
              src={`/${item}.png`}
            />
          ))}
        </div>

        <p className="lg:py-5 text-gray-300">{`${format(new Date(startDate), 'MMMM yyyy')} - ${
          endDate ? format(new Date(endDate), 'MMMM yyyy') : 'Present'
        }`}</p>

        <h1 className="text-gray-500 lg:text-xl text-lg tracking-wider">
          Responsibilities &amp; Projects
        </h1>

        <ul className="list-disc space-y-4 ml-5 lg:text-lg text-sm max-w-5 max-w-[50vw] w-[50vw] lg:w-[30vw]">
          {points.sort().map((point) => (point ? <li key={point}>{point}</li> : ''))}
        </ul>
      </div>
    </article>
  );
};

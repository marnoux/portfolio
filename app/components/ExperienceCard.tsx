import { format } from 'date-fns';
import { motion } from 'framer-motion';
import _ from 'lodash';

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
    <article className="flex flex-col rounded-lg items-center space-y-3 flex-shrink-0 w-[90vw] md:w-[600px] snap-center bg-[#363636] p-10 cursor-pointer transition-opacity duration-200 overflow-hidden">
      <motion.div
        initial={{ y: -100, opacity: 0.5 }}
        transition={{ duration: 1.2 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="w-32 h-32 xl:w-[200px] xl:h-[200px] flex items-center justify-center"
      >
        <a href={link} target="_blank" rel="noreferrer" className="block">
          <img
            alt="Experience Card Company Image"
            className="rounded-full w-32 h-32 xl:w-[200px] xl:h-[200px] object-cover object-center"
            src={`${path}${fileName}${extension}`}
          />
        </a>
      </motion.div>

      <div className="scrollMask px-0 md:px-10 space-y-3 overflow-y-scroll overflow-x-hidden text-center">
        <a href={link} target="_blank" className="font-bold text-2xl mt-1 text block" rel="noreferrer">
          {companyName}
        </a>
        <h4 className="text-xl font-light">{role}</h4>

        <div className="flex flex-row justify-center space-x-1 sm:space-x-3">
          {techUsed.map((item) => (
            <img
              key={item}
              alt="Work experience skill image"
              className="h-10 w-10 rounded-full"
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

        <ul className="list-disc space-y-4 ml-5 lg:text-lg text-sm text-left inline-block">
          {points.sort().map((point) => (point ? <li key={point}>{point}</li> : ''))}
        </ul>
      </div>
    </article>
  );
};

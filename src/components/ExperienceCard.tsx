import { format } from 'date-fns';
import { motion } from 'framer-motion';
import _ from 'lodash';
import Image from 'next/image';

type ExperienceCardProps = {
  fileName: string;
  role: string;
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
  companyName,
  path,
  extension,
  techUsed,
  startDate,
  endDate,
  points,
}: ExperienceCardProps) => {
  return (
    <article className="flex flex-col rounded-lg items-center space-y-7 flex-shrink-0 w-[500px] md:w-[600px] xl:w-[900px] snap-center bg-[#292929] p-10 cursor-pointer transition-opacity duration-200 overflow-hidden">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        transition={{ duration: 1.5 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="rounded-full xl:w-[200px] xl:h-[200px] object-cover object-center"
      >
        <Image
          alt="Experience Card Company Image"
          className="relative rounded-full w-32 h-32 object-cover"
          height={320}
          width={320}
          src={`${path}${fileName}${extension}`}
        />
      </motion.div>

      <div className="px-0 md:px-10 space-y-3">
        <h4 className="text-4xl font-light">{role}</h4>

        <p className="font-bold text-2xl mt-1">{companyName}</p>

        <div className="flex space-x-2 my-2">
          {techUsed.map((item) => (
            <Image
              key={item}
              alt="Work experience skill image"
              className="h-10 w-10 rounded-full"
              height={100}
              width={100}
              src={`/../public/assets/icons/tech/${item}.png`}
            />
          ))}
        </div>

        <p className="py-5 text-gray-300">{`${format(new Date(startDate), 'MMMM yyyy')} - ${
          endDate ? format(new Date(endDate), 'MMMM yyyy') : 'Present'
        }`}</p>

        <h1 className="text-gray-500 text-xl tracking-wider">Responsibilities &amp; Projects</h1>

        <ul className="list-disc space-y-4 ml-5 text-lg">
          {points.sort().map((point) => (point ? <li key={point}>{point}</li> : ''))}
        </ul>
      </div>
    </article>
  );
};

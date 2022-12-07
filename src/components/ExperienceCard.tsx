import { motion } from 'framer-motion';
import Image from 'next/image';

export const ExperienceCard = () => {
  return (
    <article className="flex flex-col rounded-lg items-center space-y-7 flex-shrink-0 w-[500px] md:w-[600px] xl:w-[900px] snap-center bg-[#292929] p-10 opacity-40 hover:opacity-100 cursor-pointer transition-opacity duration-200 overflow-hidden">
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
          src="https://media-exp1.licdn.com/dms/image/C4E0BAQHMeSt4_UoblQ/company-logo_200_200/0/1662660992956?e=1678320000&v=beta&t=fSo_R_CAF741iA0AQXA5K5Y4A4bim2wm4s5JbHbcAQQ"
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
            src="https://media-exp1.licdn.com/dms/image/C510BAQGyCfCQzGP_RA/company-logo_200_200/0/1519900931012?e=1678320000&v=beta&t=SDmei-7oSFSZUjaea2CiKX2Wpq1SGB818y6PrPHblSw"
          />
          <Image
            alt="heroImg"
            className="h-10 w-10 rounded-full"
            height={100}
            width={100}
            src="https://media-exp1.licdn.com/dms/image/C510BAQGyCfCQzGP_RA/company-logo_200_200/0/1519900931012?e=1678320000&v=beta&t=SDmei-7oSFSZUjaea2CiKX2Wpq1SGB818y6PrPHblSw"
          />
          <Image
            alt="heroImg"
            className="h-10 w-10 rounded-full"
            height={100}
            width={100}
            src="https://media-exp1.licdn.com/dms/image/C510BAQGyCfCQzGP_RA/company-logo_200_200/0/1519900931012?e=1678320000&v=beta&t=SDmei-7oSFSZUjaea2CiKX2Wpq1SGB818y6PrPHblSw"
          />
          <Image
            alt="heroImg"
            className="h-10 w-10 rounded-full"
            height={100}
            width={100}
            src="https://media-exp1.licdn.com/dms/image/C510BAQGyCfCQzGP_RA/company-logo_200_200/0/1519900931012?e=1678320000&v=beta&t=SDmei-7oSFSZUjaea2CiKX2Wpq1SGB818y6PrPHblSw"
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

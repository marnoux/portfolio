import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';

export const Projects = () => {
  const projects = [1];
  const ReactGitHubCalendar = dynamic(() => import('react-ts-github-calendar'), {
    ssr: false,
  });

  return (
    <div className="relative z-0 mx-auto flex h-screen max-w-full flex-col items-center justify-evenly overflow-hidden text-left md:flex-row ">
      <h3 className="absolute top-24 text-2xl uppercase tracking-[20px] text-gray-500">
        Code Contributions
      </h3>
      <div className="relative z-20 flex snap-x snap-mandatory overflow-x-scroll scrollbar overflow-y-hidden scrollbar-track-gray-400/20 scrollbar-thumb-[#36b2ed]">
        {projects.map((project, i) => (
          <div
            key={i}
            className="p20 m:p-44 flex h-screen w-screen flex-shrink-0 snap-center flex-col content-center items-center justify-center space-y-5"
          >
            <motion.div
              initial={{ y: -300, opacity: 0 }}
              transition={{ duration: 1.2 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* <Image alt={i.toString()} src={'/react.png'} height={666} width={375} /> */}
              <div className="mb-0 w-screen max-w-3xl">
                <ReactGitHubCalendar
                  cache={12 * 60 * 60 * 1000}
                  global_stats={false}
                  responsive
                  userName={'marnoux'}
                  tooltips={false}
                />
              </div>
            </motion.div>

            {/* <div>
              <h4 className="text-4xl font-semibold text-center">
                <span className="underline decoration-[#36b2ed]/40">
                  Case Study {i + 1} of {projects.length}:
                </span>
                UPS Clone
              </h4>
              <p className="text-lg text-center md:text-left p-10 max-w-4xl">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et explicabo doloribus
                distinctio repellendus odit sunt exercitationem, consequatur odio officiis velit,
                tempora voluptatum numquam autem. Dolores quisquam illo odit rem non.
              </p>
            </div> */}
          </div>
        ))}
      </div>
      <div className="absolute top-[30%] left-0 h-[500px] w-full -skew-y-12 bg-[#36b2ed]/5" />
    </div>
  );
};

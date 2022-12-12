import { motion } from 'framer-motion';
import Image from 'next/image';

export const Projects = () => {
  const projects = [1, 2, 3, 4, 5];

  return (
    <div className="h-screen relative flex overflow-hidden flex-col text-left md:flex-row max-w-full justify-evenly mx-auto items-center z-0 ">
      <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-500 text-2xl">Projects</h3>

      <div className="relative flex overflow-x-scroll overflow-y-hidden snap-x snap-mandatory z-20 scrollbar scrollbar-track-gray-400/20 scrollbar-thumb-[#36b2ed]">
        {projects.map((project, i) => (
          <div
            key={i}
            className="w-screen flex-shrink-0 snap-center flex flex-col space-y-5 items-center justify-center p20 m:p-44 h-screen content-center"
          >
            <motion.div
              initial={{ y: -300, opacity: 0 }}
              transition={{ duration: 1.2 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Image alt={i.toString()} src={'/react.png'} height={666} width={375} />
            </motion.div>

            <div>
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
            </div>
          </div>
        ))}
      </div>

      <div className="w-full absolute top-[30%] bg-[#36b2ed]/10 left-0 h-[500px] -skew-y-12" />
    </div>
  );
};

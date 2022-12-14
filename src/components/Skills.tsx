import { motion } from 'framer-motion';
import { Skill } from './Skill';
import _ from 'lodash';

export const Skills = () => {
  const path = '/';
  const extension = '.png';
  const skills = [
    { filename: 'angular', level: 50 },
    { filename: 'csharp', level: 70 },
    { filename: 'css3', level: 85 },
    { filename: 'devops', level: 70 },
    { filename: 'docker', level: 45 },
    { filename: 'tailwind', level: 80 },
    { filename: 'html5', level: 90 },
    { filename: 'javascript', level: 95 },
    { filename: 'mysql', level: 70 },
    { filename: 'php', level: 30 },
    { filename: 'polymer', level: 50 },
    { filename: 'react', level: 90 },
    { filename: 'sql', level: 75 },
    { filename: 'next', level: 90 },
    { filename: 'typescript', level: 85 },
    { filename: 'vue', level: 75 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      whileInView={{ opacity: 1 }}
      className="space-y-0 h-screen flex relative flex-col text-center md:text-left xl:flex-row md:max-w-[200rem] max-w-[90vw] w-[90vw] xl:px-10 min-h-screen justify-center xl:space-y-0 mx-auto items-center overflow-x-hidden"
    >
      <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-500 text-2xl text-center">
        Skills
      </h3>

      <h3 className="absolute top-36 uppercase tracking-[3px] text-gray-500 text-sm text-center">
        Hover over a skill for current proficiency
      </h3>

      <div className="absolute top-60 grid lg:grid-cols-4 lg:gap-5 lg:w-screen sm:w-[70vw] grid-cols-2 gap-12 ">
        {_.orderBy(skills, 'level', 'desc').map((skill, key) => {
          const name = skill.filename;

          return (
            <Skill
              key={name}
              name={name}
              level={skill.level}
              src={`${path}${name}${extension}`}
              directionLeft={key % 2 === 1}
            />
          );
        })}
      </div>
    </motion.div>
  );
};

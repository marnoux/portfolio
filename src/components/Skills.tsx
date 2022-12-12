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
    { filename: 'dotnet', level: 60 },
    { filename: 'html5', level: 90 },
    { filename: 'javascript', level: 95 },
    { filename: 'mysql', level: 70 },
    { filename: 'php', level: 30 },
    { filename: 'polymer', level: 50 },
    { filename: 'react', level: 90 },
    { filename: 'sql', level: 80 },
    { filename: 'next', level: 90 },
    { filename: 'typescript', level: 85 },
    { filename: 'vue', level: 75 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      whileInView={{ opacity: 1 }}
      className="space-y-0 h-screen flex relative flex-col text-center md:text-left xl:flex-row md:max-w-[200rem] max-w-[100vw] w-[100vw] xl:px-10 min-h-screen justify-center xl:space-y-0 mx-auto items-center"
    >
      <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-500 text-2xl">Skills</h3>

      <h3 className="absolute top-36 uppercase tracking-[3px] text-gray-500 text-sm w-[43vw]">
        Hover over a skill for current proficiency
      </h3>

      <div className="grid grid-cols-4 gap-5 w-90vw">
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

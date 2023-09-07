import { motion } from 'framer-motion';
import _ from 'lodash';
import { ExperienceCard } from './ExperienceCard';

export const Experience = () => {
  const path = '/';
  const extension = '.jpg';

  const experience = [
    {
      name: 'MCM Promotions',
      fileName: 'mcm',
      link: 'https://mcmpromotions.co.za/',
      startDate: '2016-01-04',
      endDate: '2016-07-15',
      role: 'IT Consultant',
      points: [
        'Development and maintenance of costing system',
        'Development and implementation of company website',
        'Maintenance of software and networking equipment',
        'Adding online presence to company by creating and maintaining Online Shop',
      ],
      tech: ['html5', 'css3', 'javascript', 'csharp', 'sql'],
    },
    {
      name: 'Direct Transact',
      fileName: 'dt',
      link: 'https://www.linkedin.com/company/direct-transact/',
      startDate: '2016-07-15',
      endDate: '2020-01-31',
      role: 'Full Stack Developer',
      points: [
        'Improving performance of services',
        'Writing, implementing and maintaining solutions in all phases of the software development life cycle',
        'African Bank transactional banking system - Team Member',
        'Grobank Loan Module - Team Member',
        'Hello Paisa transactional banking system - Co Lead Developer (02/2018 - 04/2019)',
        'Sasfin Bank Revolving Credit Facility - Co Lead Developer (06/2019 - 09/2019)',
        'Ubank Prepaid Cards-Lead Developer (09/2019 - 01/2020)',
      ],
      tech: ['sql', 'javascript', 'html5', 'css3', 'csharp', 'angular'],
    },
    {
      name: 'Derivco',
      fileName: 'derivco',
      link: 'https://www.linkedin.com/company/derivco/',
      startDate: '2020-02-03',
      endDate: '2022-01-14',
      role: 'Full Stack Developer',
      points: [
        'Development Lead on multiple projects',
        'Implementing all parts of the DevOps methodology',
        'Improving system performance & reliability',
        'Reducing deliverable lead times and improving time to market',
      ],
      tech: ['sql', 'polymer', 'html5', 'css3', 'csharp', 'javascript', 'vue', 'devops'],
    },
    {
      name: 'Castor',
      fileName: 'castor',
      link: 'https://www.linkedin.com/company/castoredc/',
      startDate: '2022-02-01',
      endDate: '2023-02-01',
      role: 'Senior Frontend Engineer',
      points: [
        'Moving the React Front End towards a well-structured and accessible experience',
        'Furthering our efforts towards automated unit, functional and acceptance tests',
        'Supporting QA with infrastructure, allowing them to create End-to-End tests',
        'Collaborating to implement existing components and add new capabilities to the system',
        'Extracting components from legacy ExtJS projects',
        'Following the Castor quality policy, information security policy, the code of conduct and the procedures from the Quality and Information Security Management system',
      ],
      tech: ['react', 'next', 'typescript', 'javascript', 'html5', 'css3', 'docker'],
    },
    {
      name: 'Newzoo',
      fileName: 'newzoo',
      link: 'https://www.linkedin.com/company/newzoo',
      startDate: '2023-02-01',
      endDate: '',
      role: 'Senior Frontend Developer',
      points: [
        'Writing SOLID code',
        'Participating in all aspects of sprints e.g. planning, refinement',
        'Contributing towards frontend architecture and design',
        'Guiding the team in making the right decisions in all things frontend',
        'Taking ownership of feature development, and working together with stakeholders, design, and other engineers to build features',
        'Mentoring peers and junior developers',
        'Take the initiative to address technical debt',
        'Spot opportunities to improve on the status quo',
      ],
      tech: ['react', 'typescript', 'javascript', 'html5', 'css3'],
    },
  ];

  return (
    <div className="h-screen md:flew-row relative mx-auto flex flex-col items-center justify-evenly overflow-y-hidden px-10 text-left">
      <h3 className="absolute top-20 md:top-20 text-2xl uppercase tracking-[20px] text-gray-500">
        Experience
      </h3>
      <h4 className="absolute top-[6.5rem] text-lg text-gray-500">
        <span className="text-2xl">→</span>
        {' for more'}
      </h4>

      <motion.div className="flex snap-x snap-mandatory space-x-5 h-[85vh] mt-20 overflow-x-scroll overflow-y-hidden lg:max-w-[50vw] p-10  w-[80vw] scrollbar scrollbar-track-gray-400/20 scrollbar-thumb-[#36b2ed]">
        {_.orderBy(experience, 'startDate', 'desc').map((e) => (
          <ExperienceCard
            key={e.name}
            link={e.link}
            path={path}
            extension={extension}
            fileName={e.fileName}
            role={e.role}
            companyName={e.name}
            techUsed={e.tech}
            startDate={e.startDate}
            endDate={e.endDate}
            points={e.points}
          />
        ))}
      </motion.div>
    </div>
  );
};

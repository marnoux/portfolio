import Image from 'next/image';
import Link from 'next/link';
import { Cursor, useTypewriter } from 'react-simple-typewriter';
import { BackgroundCircles } from './BackgroundCircles';

export const Hero = () => {
  const [text] = useTypewriter({
    words: [
      'Marnoux', //
      'a <WebDeveloper />',
    ],
    loop: true,
    delaySpeed: 2000,
  });

  return (
    <div className="mx-auto flex h-screen flex-col items-center justify-center space-y-8 overflow-hidden text-center">
      <BackgroundCircles />
      <Image
        alt="heroImg"
        className="relative h-32 w-32 rounded-full object-cover"
        height={320}
        width={320}
        priority
        src="/hero-img.png"
      />
      <div className="z-20">
        <h2 className="pb-2 text-sm uppercase tracking-[15px] text-gray-500">Front-End Engineer</h2>
        <h1 className="scroll-px-10 text-5xl font-semibold lg:text-6xl">
          <span className="static">{`I'm ${text}`}</span>
          <Cursor cursorColor="#36b2ed" />
        </h1>
        <div>
          <Link href={'#about'}>
            <button className="heroButton">About</button>
          </Link>
          <Link href={'#experience'}>
            <button className="heroButton">Experience</button>
          </Link>
          <Link href={'#skills'}>
            <button className="heroButton">Skills</button>
          </Link>
          <Link href={'#projects'}>
            <button className="heroButton">Contributions</button>
          </Link>
          <Link href={'#contact'}>
            <button className="heroButton">Contact</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

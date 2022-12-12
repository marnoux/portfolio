import Image from 'next/image';
import Link from 'next/link';
import { Cursor, useTypewriter } from 'react-simple-typewriter';
import { BackgroundCircles } from './BackgroundCircles';

type Props = {};

export const Hero = (props: Props) => {
  const [text, count] = useTypewriter({
    words: [
      'Marnoux', //
      'a <WebDeveloper />',
      'a husband & father',
      'a musician',
    ],
    loop: true,
    delaySpeed: 2000,
  });

  return (
    <div className="h-screen flex flex-col space-y-8 items-center justify-center text-center overflow-hidden">
      <BackgroundCircles />
      <Image
        alt="heroImg"
        className="relative rounded-full w-32 h-32 object-cover"
        height={320}
        width={320}
        priority
        src="/hero-img.png"
      />
      <div className="z-20">
        <h2 className="text-sm uppercase text-gray-500 pb-2 tracking-[15px]">Front-End Engineer</h2>
        <h1 className="text-5xl lg:text-6xl font-semibold scroll-px-10">
          <span>{`I'm ${text}`}</span>
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
          {/* <Link href={'#projects'}>
            <button className="heroButton">Projects</button>
          </Link> */}
          <Link href={'#contact'}>
            <button className="heroButton">Contact</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

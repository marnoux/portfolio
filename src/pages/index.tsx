import Head from 'next/head';
import { About } from '../components/About';
import { ContactMe } from '../components/ContactMe';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Projects } from '../components/Projects';
import { Skills } from '../components/Skills';
import { Experience } from '../components/Experience';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="z-0 h-screen snap-y snap-mandatory overflow-x-scroll overflow-y-scroll bg-[rgb(36,36,36)] text-white scrollbar scrollbar-track-gray-400/20 scrollbar-thumb-[#36b2ed] sm:max-w-fit">
      <Head>
        <title>{`Marnoux's Portfolio`}</title>
      </Head>

      {/* Header */}
      <Header />

      {/* Hero */}
      <section id="hero" className="snap-start">
        <Hero />
      </section>

      {/* About */}
      <section id="about" className="snap-start">
        <About />
      </section>
      {/* Experience */}
      <section id="experience" className="snap-center">
        <Experience />
      </section>

      {/* Skills */}
      <section id="skills" className="snap-start">
        <Skills />
      </section>

      {/* Projects */}
      {/* <section id="projects" className="snap-start">
        <Projects />
      </section> */}
      {/* Contact Me */}
      <section id="contact" className="snap-start">
        <ContactMe />
      </section>

      <Link href="#hero">
        <footer className="sticky bottom-5 w-full cursor-pointer ">
          <div className="flex items-center justify-center">
            <Image
              alt={'Footer arrow'}
              className="h-7 w-7 cursor-pointer filter invert"
              height={10}
              src="/up-arrow.svg"
              width={10}
            />
          </div>
        </footer>
      </Link>
    </div>
  );
}

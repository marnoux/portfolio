import type { Route } from "./+types/home";
import { About } from '../components/About';
import { ContactMe } from '../components/ContactMe';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Projects } from '../components/Projects';
import { Skills } from '../components/Skills';
import { Experience } from '../components/Experience';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Marnoux's Portfolio" },
    { name: "description", content: "Welcome to Marnoux's portfolio!" },
  ];
}

export default function Home() {
  return (
    <div className="z-0 h-screen snap-y snap-mandatory overflow-x-scroll overflow-y-scroll bg-[rgb(36,36,36)] text-white scrollbar scrollbar-track-gray-400/20 scrollbar-thumb-[#36b2ed]">
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
      <section id="projects" className="snap-start">
        <Projects />
      </section>

      {/* Contact Me */}
      <section id="contact" className="snap-start">
        <ContactMe />
      </section>

      <div className="sticky bottom-5 cursor-pointer flex mt-auto mb-auto flex-grow-1 items-right justify-center w-auto">
        <img
          alt="Footer arrow"
          className="h-7 w-7 cursor-pointer filter invert"
          src="/up-arrow.svg"
          onClick={() => window.location.replace('#hero')}
        />
      </div>
    </div>
  );
}

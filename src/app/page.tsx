import { Vision } from "@/components/portfolio/about";
import { Background } from "@/components/portfolio/background";
import { Contact } from "@/components/portfolio/contact";
import { CursorGlow } from "@/components/portfolio/cursor-glow";
import { Experience } from "@/components/portfolio/experience";
import { Footer } from "@/components/portfolio/footer";
import { Hero } from "@/components/portfolio/hero";
import { Nav } from "@/components/portfolio/nav";
import { Projects } from "@/components/portfolio/projects";
import { Skills } from "@/components/portfolio/skills";

export default function Portfolio() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Background />
      <CursorGlow />
      <Nav />
      <main>
        <Hero />
        <Vision />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

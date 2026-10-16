import { Vision } from "@/components/portfolio/about";
import { Background } from "@/components/portfolio/background";
import { Contact } from "@/components/portfolio/contact";
import { Experience } from "@/components/portfolio/experience";
import { Footer } from "@/components/portfolio/footer";
import { Hero } from "@/components/portfolio/hero";
import { Nav } from "@/components/portfolio/nav";
import { Skills } from "@/components/portfolio/skills";

export default function Portfolio() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Background />
      <Nav />
      <main>
        <Hero />
        <Vision />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

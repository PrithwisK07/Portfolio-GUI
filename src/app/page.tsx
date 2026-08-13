import SmoothScroll from "@/components/SmoothScroll";
import BackgroundCanvas from "@/components/BackgroundCanvas";
import Preloader from "@/components/Preloader";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <Preloader />
      <BackgroundCanvas />
      <div className="noise"></div>
      <Navigation />

      <main id="smooth-wrapper">
        <div id="smooth-content">
          <Hero />
          <About />
          <Services />
          <Projects />
          <Footer />
        </div>
      </main>
    </SmoothScroll>
  );
}
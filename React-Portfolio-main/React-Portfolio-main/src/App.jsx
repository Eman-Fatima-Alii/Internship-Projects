import SmoothScroll from "./components/SmoothScroll";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import CurvedRibbon from "./components/CurvedRibbon";
import Work from "./components/Work";
import Skills from "./components/Skills";
import Method from "./components/Method";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";

function App() {
  return (
    <SmoothScroll>
      <div className="min-h-screen relative overflow-x-hidden" style={{ background: "var(--bg)" }}>
        <Nav />
        <main>
          {/* Executive Hero Section */}
          <Hero />

          {/* Sleek Cyber Curved Accent Ribbon */}
          <CurvedRibbon />

          {/* Featured Bento Projects Showcase */}
          <Work />

          {/* Interactive Technology & Skills Hub */}
          <Skills />

          {/* Engineering Process Roadmap */}
          <Method />

          {/* Executive Bio & Value Proposition */}
          <About />

          {/* High-Converting Glassmorphic Contact Hub */}
          <Contact />
        </main>
        <Footer />
        <BackToTop />
      </div>
    </SmoothScroll>
  );
}

export default App;


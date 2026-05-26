import Navbar from "../sections/Navbar";

import HeroSection from "../sections/HeroSection";

import FeaturesSection from "../sections/FeaturesSection";

import AboutSection from "../sections/AboutSection";

import Footer from "../sections/Footer";

export default function LandingPage() {

  return (
    <div className="landing-page">

      {/* =========================
          NAVBAR
      ========================= */}

      <Navbar />

      {/* =========================
          HERO
      ========================= */}

      <HeroSection />

      {/* =========================
          FEATURES
      ========================= */}

      <FeaturesSection />

      {/* =========================
          ABOUT
      ========================= */}

      <AboutSection />

      {/* =========================
          FOOTER
      ========================= */}

      <Footer />

    </div>
  );
}
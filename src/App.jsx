import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import HeroSection from '@/components/sections/Hero';
import ServicesSection from '@/components/sections/Services';
import GalleryWithFallback from '@/components/sections/GalleryWithFallback';
import ConditionsSection from '@/components/sections/Conditions';
import TestimonialsSection from '@/components/sections/Testimonials';
import FaqSection from '@/components/sections/Faq';
import ContactSection from '@/components/sections/ContactForm';
import Footer from '@/components/sections/Footer';
import CountdownTimer from '@/components/ui/CountdownTimer';
import KentHealthcarePopup from '@/components/ui/KentHealthcarePopup';
import UnifiedContactWidget from '@/components/ui/UnifiedContactWidget';
import { motion } from 'framer-motion';
import { ConfigProvider, useConfig } from '@/contexts/ConfigContext';

function AppContent() {
  const { images } = useConfig();
  const logoUrl = images.logoUrl;

  const scrollToForm = (e) => {
    e.preventDefault();
    const formSection = document.getElementById('contact-form-fields');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Toaster />
      <header className="sticky top-0 z-50 shadow-md backdrop-blur-md" style={{ backgroundColor: '#028598' }} dir="ltr">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src={logoUrl} alt="Kent Healthcare Logo" className="h-10 md:h-12" />
          </motion.div>
          <motion.a
            href="#contact-form-fields"
            onClick={scrollToForm}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="px-6 py-2 text-sm font-medium text-accent-foreground rounded-md bg-accent hover:bg-accent/90 transition-colors shadow-md hover:shadow-lg cursor-pointer"
          >
            Book Now
          </motion.a>
        </div>
      </header>
      <CountdownTimer 
        message="Book a consultation and get a FREE session! Limited time offer. Limited spots available." 
      />
      <main className="flex-grow">
        <HeroSection />
        <ServicesSection />
        <GalleryWithFallback tag="physiotherapy" />
        <ConditionsSection />
        <TestimonialsSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
      
      {/* Kent Healthcare Optimized Popup */}
      <KentHealthcarePopup />
      
      {/* Unified Contact Widget */}
      <UnifiedContactWidget />
    </div>
  );
}

function App() {
  return (
    <ConfigProvider>
      <AppContent />
    </ConfigProvider>
  );
}

export default App;

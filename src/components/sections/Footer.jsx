import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 text-gray-300 py-8 text-center"
      dir="ltr"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <p className="text-lg font-semibold text-white" dir="ltr">Kent Healthcare</p>
          <p className="text-sm" dir="ltr">Specialized physiotherapy for your comfort and well-being.</p>
        </div>
        <div className="mb-4 text-sm">
          <p dir="ltr">
            For bookings and inquiries:{' '}
            <a href="tel:+971507547326" className="text-primary hover:text-accent transition-colors" dir="ltr">
              +971 50 754 7326
            </a>
          </p>
          <p>
            <a href="#contact" className="text-primary hover:text-accent transition-colors" dir="ltr">
              Book Your Session Now
            </a>
          </p>
        </div>
        <div className="border-t border-gray-700 pt-4 mt-4 text-xs">
          <p dir="ltr">&copy; {currentYear} Kent Healthcare. All rights reserved.</p>
          <p>
            <a href="/privacy-policy" className="hover:text-white transition-colors mr-2" dir="ltr">
              Privacy Policy
            </a>
            |
            <a href="/terms-of-service" className="hover:text-white transition-colors ml-2" dir="ltr">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;

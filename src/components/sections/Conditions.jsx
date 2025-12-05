import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useConfig } from '@/contexts/ConfigContext';

const conditions = [
  'Post-stroke rehabilitation and cognitive re-learning',
  'Parkinson\'s disease - movement and mood regulation',
  'Neurological disorders (Multiple Sclerosis, brain injuries)',
  'Musculoskeletal injuries with behavioral impact',
  'Movement problems related to fear and anxiety',
  'Post-surgical treatment (joint replacement, fractures)'
];

const SectionTitle = ({ children }) => (
  <motion.h2 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.5 }}
    className="text-3xl md:text-4xl font-bold text-center text-primary mb-12"
  >
    {children}
  </motion.h2>
);

const ConditionsSection = () => {
  const { images } = useConfig();
  
  return (
    <section id="conditions" className="py-16 md:py-24 bg-secondary/30" dir="ltr">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle dir="ltr">Conditions We Treat</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          {conditions.map((condition, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-start space-x-reverse space-x-3 p-4 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <span className="text-lg text-foreground" dir="ltr">{condition}</span>
            </motion.div>
          ))}
        </div>
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <img
            className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto rounded-lg shadow-lg"
            alt="Patient undergoing physiotherapy session"
            src={images.conditionsImage}
          />
          <p className="mt-4 text-muted-foreground text-sm" dir="ltr">
            Demonstration of physiotherapy techniques in action.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ConditionsSection;

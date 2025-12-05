import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, UserCheck, Users, Activity, Calendar, TrendingUp, Search, FileText, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

const services = [
  {
    icon: <Heart className="w-10 h-10 text-primary" />,
    title: 'Immediate Pain Relief',
    description:
      'Advanced techniques to reduce pain and inflammation quickly and effectively',
  },
  {
    icon: <UserCheck className="w-10 h-10 text-primary" />,
    title: 'Personalized Treatment Plans',
    description:
      'Every treatment plan is designed specifically for your condition and individual needs',
  },
  {
    icon: <Users className="w-10 h-10 text-primary" />,
    title: 'Expert Team',
    description:
      'Internationally certified specialists with years of exceptional experience',
  },
  {
    icon: <Activity className="w-10 h-10 text-primary" />,
    title: 'Modern Equipment',
    description:
      'Latest technologies and advanced equipment to ensure the best results',
  },
  {
    icon: <Calendar className="w-10 h-10 text-primary" />,
    title: 'Flexible Appointments',
    description:
      'We provide appointments that fit your busy schedule, including evenings and weekends',
  },
  {
    icon: <TrendingUp className="w-10 h-10 text-primary" />,
    title: 'Continuous Follow-up',
    description:
      'We monitor your progress and adjust the plan as needed to ensure complete recovery',
  },
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

const ServicesSection = () => (
  <section id="services" className="py-16 md:py-24 bg-background" dir="ltr">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <SectionTitle dir="ltr">What Makes Our Services Special?</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <Card className="h-full hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur-sm border border-primary/20">
              <CardHeader className="items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">{service.icon}</div>
                <CardTitle className="text-xl text-primary" dir="ltr">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground" dir="ltr">{service.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-2xl p-8 mt-12"
      >
        <h3 className="text-2xl font-bold text-center text-teal-800 mb-6">
          What Does the Free Session Include?
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-teal-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-semibold text-teal-800 mb-2">Comprehensive Assessment</h4>
            <p className="text-teal-700 text-sm">Thorough examination of your condition and identification of root causes</p>
          </div>
          <div className="text-center">
            <div className="bg-teal-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-semibold text-teal-800 mb-2">Personalized Treatment Plan</h4>
            <p className="text-teal-700 text-sm">Custom treatment program designed specifically for your needs and goals</p>
          </div>
          <div className="text-center">
            <div className="bg-teal-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-semibold text-teal-800 mb-2">Immediate Practical Tips</h4>
            <p className="text-teal-700 text-sm">Actionable advice you can apply right away to improve your condition</p>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default ServicesSection;

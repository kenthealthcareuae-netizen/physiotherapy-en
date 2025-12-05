import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { motion } from 'framer-motion';

const faqs = [
  {
    question: 'Is the session really free?',
    answer:
      'Yes, the first session is completely free with no obligations. It includes a comprehensive assessment, personalized treatment plan, and immediate practical tips.',
  },
  {
    question: 'What happens after booking?',
    answer:
      'We will contact you within 24 hours to confirm your appointment and send location details. You can also get immediate tips over the phone.',
  },
  {
    question: 'How long does the session take and is it painful?',
    answer:
      'The session lasts 45-60 minutes. Physiotherapy is not painful but comfortable and soothing. We use gentle and safe techniques.',
  },
  {
    question: 'Do I need a doctor\'s referral?',
    answer:
      'No, you don\'t need a medical referral. You can book directly. We will assess your condition and advise if you need additional medical consultation.',
  },
  {
    question: 'What types of conditions do you treat?',
    answer:
      'We treat back and neck pain, sports injuries, joint pain, balance problems, post-surgery rehabilitation, and much more.',
  },
  {
    question: 'Do you have evening or weekend appointments?',
    answer:
      'Yes, we provide flexible appointments including evenings and weekends to fit your busy schedule.',
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

const FaqSection = () => (
  <section id="faq" className="py-16 md:py-24 bg-secondary/30" dir="ltr">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <SectionTitle dir="ltr">Frequently Asked Questions</SectionTitle>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-card p-6 sm:p-8 rounded-lg shadow-xl border border-primary/10"
      >
        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              value={`item-${index}`}
              key={index}
              className="border-b border-border last:border-b-0 rounded-md overflow-hidden transition-all hover:shadow-md bg-background/50 hover:bg-background"
            >
              <AccordionTrigger className="text-md sm:text-lg font-medium text-start px-6 py-4 flex justify-between items-center w-full hover:text-accent" dir="ltr">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed px-6 pb-4 pt-2 text-sm sm:text-base" dir="ltr">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  </section>
);

export default FaqSection;

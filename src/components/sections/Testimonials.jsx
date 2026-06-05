// import React from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Quote, UserCircle, Award, Shield } from 'lucide-react';
// import { motion } from 'framer-motion';

// const testimonials = [
//   {
//     name: 'J.M',
//     location: 'Dubai',
//     quote:
//       'I had chronic back pain for years. After just 6 sessions, the pain completely disappeared. The team is very professional and the results are amazing!',
//     rating: 5
//   },
//   {
//     name: 'S.A',
//     location: 'Abu Dhabi',
//     quote:
//       'A knee injury prevented me from playing sports. The physiotherapy here got me back to my normal life. I recommend this place to everyone.',
//     rating: 5
//   },
//   {
//     name: 'M.H',
//     location: 'Sharjah',
//     quote:
//       'The free session was very helpful. I discovered problems I didn\'t know I had. Now I come regularly and the improvement is clear every week.',
//     rating: 5
//   }
// ];

// const SectionTitle = ({ children }) => (
//   <motion.h2
//     initial={{ opacity: 0, y: 20 }}
//     whileInView={{ opacity: 1, y: 0 }}
//     viewport={{ once: true, amount: 0.3 }}
//     transition={{ duration: 0.5 }}
//     className="text-3xl md:text-4xl font-bold text-center text-primary mb-12"
//   >
//     {children}
//   </motion.h2>
// );

// const TestimonialsSection = () => {
//   return (
//     <section id="testimonials" className="py-16 md:py-24 bg-background" dir="ltr">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <SectionTitle dir="ltr">What Our Patients Say</SectionTitle>
//         {/* Limit the max width so two columns look balanced */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto max-w-5xl">
//           {testimonials.map((t, idx) => (
//             <motion.div
//               key={idx}
//               initial={{ opacity: 0, scale: 0.9 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               viewport={{ once: true, amount: 0.2 }}
//               transition={{ duration: 0.5, delay: idx * 0.1 }}
//               className="w-full"
//             >
//               <Card className="h-full bg-card/80 backdrop-blur-sm border border-primary/20 shadow-lg hover:shadow-primary/20 transition-all duration-300">
//                 <CardContent className="pt-6">
//                   <div className="flex items-start space-x-reverse space-x-4 p-4">
//                     <UserCircle className="w-12 h-12 text-primary flex-shrink-0" />
//                     <div className="flex-grow">
//                       <Quote className="w-8 h-8 text-accent/50 mb-2" />
//                       <p className="text-foreground italic mb-4 leading-relaxed" dir="ltr">
//                         "{t.quote}"
//                       </p>
//                       <p className="font-semibold text-primary" dir="ltr">– {t.name} ({t.location})</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))}
//         </div>
        
//         {/* Credentials Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, amount: 0.3 }}
//           transition={{ duration: 0.5 }}
//           className="mt-16"
//         >
//           <h3 className="text-2xl font-bold text-center text-primary mb-8">
//             Our Credentials & Accreditation
//           </h3>
//           <div className="grid md:grid-cols-2 gap-6">
//             <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
//               <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Award className="h-6 w-6 text-white" />
//               </div>
//               <h4 className="font-semibold text-blue-800 mb-2">Experienced & Licensed Therapists</h4>
//               <p className="text-blue-700 text-sm">Our physiotherapists are licensed professionals with years of clinical experience in rehabilitation, pain management and movement restoration.</p>
//             </div>
//             <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
//               <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Shield className="h-6 w-6 text-white" />
//               </div>
//               <h4 className="font-semibold text-green-800 mb-2">Modern Facilities & Personalised Care</h4>
//               <p className="text-green-700 text-sm">We use state‑of‑the‑art equipment and create customised treatment plans tailored to each patient's needs, ensuring safe and effective therapy.</p>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default TestimonialsSection;

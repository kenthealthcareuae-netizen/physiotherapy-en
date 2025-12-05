import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea as ShadcnTextarea } from '@/components/ui/textarea'; 
import { useToast } from '@/components/ui/use-toast';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { useConfig } from '@/contexts/ConfigContext';

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

const ContactSection = () => {
  const { toast } = useToast();
  const { emailjsConfig } = useConfig();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast({
        title: 'Submission Error',
        description: 'Please fill in both your name and phone number.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);

    try {
      // Capture GCLID and UTM parameters
      const gclid = localStorage.getItem('gclid') || new URLSearchParams(window.location.search).get('gclid');
      const utmParams = {
        utm_source: new URLSearchParams(window.location.search).get('utm_source'),
        utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
        utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign'),
        utm_term: new URLSearchParams(window.location.search).get('utm_term'),
        utm_content: new URLSearchParams(window.location.search).get('utm_content')
      };

      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        {
          from_name: formData.name,
          phone: formData.phone,
          email: formData.email || 'Not provided',
          subject: 'Lead from English Physiotherapy Contact Form',
          message: `FORM METHOD: English Physiotherapy Contact Form

LEAD DETAILS:
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email || 'N/A'}
Message: ${formData.message || 'N/A'}

PAGE INFO:
Language: English
Page Type: Physiotherapy Landing Page (English)
Page URL: ${window.location.href}

TRACKING DATA:
GCLID: ${gclid || 'N/A'}
UTM Source: ${utmParams.utm_source || 'N/A'}
UTM Medium: ${utmParams.utm_medium || 'N/A'}
UTM Campaign: ${utmParams.utm_campaign || 'N/A'}
UTM Term: ${utmParams.utm_term || 'N/A'}
UTM Content: ${utmParams.utm_content || 'N/A'}
User Agent: ${navigator.userAgent}
Timestamp: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' })}`,
          gclid: gclid || 'N/A',
          utm_source: utmParams.utm_source || 'N/A',
          utm_campaign: utmParams.utm_campaign || 'N/A'
        },
        emailjsConfig.publicKey
      );

      // Google Ads Conversion Tracking
      if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
          'send_to': 'AW-16614033926/29hRCIHVqasbEIaUmPI9',
          'value': 0,
          'currency': 'AED',
          'transaction_id': new Date().toISOString(),
          'gclid': gclid || localStorage.getItem('gclid')
        });
      }

      // Google Tag Manager DataLayer Event
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          'event': 'contact_form_submission',
          'form_type': 'contact_form',
          'lead_name': formData.name,
          'lead_phone': formData.phone,
          'lead_email': formData.email || 'N/A',
          'lead_message': formData.message || 'N/A',
          'gclid': gclid || localStorage.getItem('gclid'),
          'utm_source': utmParams.utm_source,
          'utm_campaign': utmParams.utm_campaign,
          'conversion_value': 0,
          'timestamp': new Date().toISOString()
        });
      }

      // Meta Pixel Lead Event
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          event: 'fb_lead',
          content_name: 'Contact Form Submission',
          content_category: 'Healthcare',
          value: 0,
          currency: 'AED',
          gclid: gclid || localStorage.getItem('gclid')
        });
      }

      toast({
        title: 'Request Received!',
        description: 'You will be redirected to the thank-you page shortly.',
      });
      setFormData({ name: '', phone: '', email: '', message: '' });
      setTimeout(() => {
        window.location.href = emailjsConfig.redirectUrl;
      }, 300);
    } catch (error) {
      console.error('Contact form submission error:', error);
      toast({
        title: 'An error occurred',
        description: `Failed to send: ${error.message || 'Unknown error'}. Please try again or contact us directly.`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-background" dir="ltr">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle dir="ltr">Contact Us & Book Your Session</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
          
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 p-8 bg-card rounded-lg shadow-xl border border-primary/10 h-full flex flex-col"
          >
            <h3 className="text-2xl font-semibold text-primary mb-6" dir="ltr">Contact Information</h3>
            <div className="space-y-4 flex-grow">
              <a href="tel:+971507547326" className="flex items-center space-x-3 group">
                <Phone className="w-6 h-6 text-accent group-hover:text-primary transition-colors" />
                <span className="text-lg text-foreground group-hover:text-primary transition-colors" dir="ltr">+971 50 754 7326</span>
              </a>
              <a href="mailto:info@kenthealthcare.ae" className="flex items-center space-x-3 group">
                <Mail className="w-6 h-6 text-accent group-hover:text-primary transition-colors" />
                <span className="text-lg text-foreground group-hover:text-primary transition-colors">info@kenthealthcare.ae</span>
              </a>
              <div className="flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-accent" />
                <a 
                  href="https://maps.app.goo.gl/2SmhDUwTwHAJXHF59" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lg text-foreground hover:text-primary transition-colors"
                  dir="ltr"
                >
                  Kent Healthcare LLC, Nashwan Building – 208C Al Mankhool Rd – above Emirates NBD Bank – Al Raffa – Dubai<br />
                  PO Box – 123657
                </a>
              </div>
            </div>
            <div className="pt-6 border-t border-border">
              <h3 className="text-xl font-semibold text-primary mb-4" dir="ltr">Working Hours</h3>
              <p className="text-foreground" dir="ltr">Monday – Saturday: 9:00 AM – 8:00 PM</p>
              <p className="text-foreground" dir="ltr">Sunday: 9:00 AM – 8:00 PM</p>
            </div>
          </motion.div>

          {/* Booking Form */}
          <motion.form
            id="contact-form-fields"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 p-8 bg-card rounded-lg shadow-xl border border-primary/10 h-full flex flex-col"
          >
            <h3 className="text-2xl font-semibold text-primary mb-6" dir="ltr">Quick Booking Form</h3>
            <div className="flex-grow space-y-4">
              <div>
                <Label htmlFor="name" className="mb-1 block text-sm font-medium text-foreground" dir="ltr">
                  Full Name*
                </Label>
                <Input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Smith"
                  dir="ltr"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="phone" className="mb-1 block text-sm font-medium text-foreground" dir="ltr">
                  Phone Number*
                </Label>
                <Input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +971501234567"
                  dir="ltr"
                  style={{ direction: 'ltr', textAlign: 'left' }}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground" dir="ltr">
                  Email (Optional)
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. example@mail.com"
                  dir="ltr"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="message" className="mb-1 block text-sm font-medium text-foreground" dir="ltr">
                  Additional Message (Optional)
                </Label>
                <ShadcnTextarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Any preferences or questions?"
                  dir="ltr"
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full bg-accent hover:bg-accent/90 text-lg group mt-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Submit Booking Request'}
              {!isSubmitting && (
                <Send className="ms-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              )}
            </Button>
          </motion.form>
        </div>
      </div>

      {/* Find Us Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4" dir="ltr">Find Us</h2>
              <p className="text-lg text-muted-foreground" dir="ltr">Visit our clinic in the heart of Dubai</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Location Info */}
                <div className="text-center md:text-left">
                  <div className="text-6xl mb-6">📍</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4" dir="ltr">Kent Healthcare LLC</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed" dir="ltr">
                    Nashwan Building – 208C Al Mankhool Rd<br />
                    Above Emirates NBD Bank – Al Raffa – Dubai<br />
                    PO Box – 123657
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                    <a 
                      href="https://maps.app.goo.gl/2SmhDUwTwHAJXHF59" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium"
                    >
                      🗺️ Open in Google Maps
                    </a>
                    <a 
                      href="https://www.google.com/maps/dir//Nashwan+Building,+208C+Al+Mankhool+Rd,+Dubai,+UAE" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                      🧭 Get Directions
                    </a>
                  </div>
                </div>
                
                {/* Interactive Google Map */}
                <a 
                  href="https://maps.app.goo.gl/2SmhDUwTwHAJXHF59" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="rounded-lg overflow-hidden h-64 md:h-80 relative group cursor-pointer block"
                >
                  <img
                    src="https://res.cloudinary.com/du2afeuwp/image/upload/v1761226644/Screenshot_2025-10-23_at_5.37.08_PM_hlwhqp.png"
                    alt="Kent Healthcare Location Map"
                    className="w-full h-full object-cover"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-5xl mb-3">🗺️</div>
                      <p className="text-xl font-bold" dir="ltr">Click to Open in Google Maps</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

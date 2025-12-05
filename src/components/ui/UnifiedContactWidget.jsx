import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { X, MessageCircle, Phone, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import trackingManager from '@/utils/tracking';
import emailjs from '@emailjs/browser';
import { useConfig } from '@/contexts/ConfigContext';

const UnifiedContactWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const { toast } = useToast();
  const { emailjsConfig } = useConfig();

  // Prevent body scroll when widget is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      const body = document.body;
      const html = document.documentElement;
      
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
      body.style.overflow = 'hidden';
      body.style.height = '100%';
      html.style.overflow = 'hidden';
      html.style.height = '100%';
      body.style.touchAction = 'none';
      html.style.touchAction = 'none';
      body.setAttribute('data-scroll-y', scrollY.toString());
      
      return () => {
        const storedScrollY = body.getAttribute('data-scroll-y');
        body.style.position = '';
        body.style.top = '';
        body.style.width = '';
        body.style.overflow = '';
        body.style.height = '';
        body.style.touchAction = '';
        html.style.overflow = '';
        html.style.height = '';
        html.style.touchAction = '';
        body.removeAttribute('data-scroll-y');
        
        if (storedScrollY) {
          window.scrollTo(0, parseInt(storedScrollY));
        }
      };
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitLeadData = async (actionType) => {
    if (!validateForm()) return;

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

      // Prepare data for Google Sheets
      const leadData = {
        timestamp: new Date().toISOString(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        gclid: gclid,
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
        utm_term: utmParams.utm_term,
        utm_content: utmParams.utm_content,
        source: `Unified Widget - ${actionType}`,
        page_url: window.location.href,
        user_agent: navigator.userAgent
      };

      // Send EmailJS email
      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        {
          from_name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: 'N/A',
          subject: `Unified Widget Lead - ${actionType}`,
          message: `FORM METHOD: Unified Contact Widget - ${actionType}

LEAD DETAILS:
Name: ${formData.name.trim()}
Phone: ${formData.phone.trim()}

TRACKING DATA:
GCLID: ${gclid || 'N/A'}
UTM Source: ${utmParams.utm_source || 'N/A'}
UTM Medium: ${utmParams.utm_medium || 'N/A'}
UTM Campaign: ${utmParams.utm_campaign || 'N/A'}
UTM Term: ${utmParams.utm_term || 'N/A'}
UTM Content: ${utmParams.utm_content || 'N/A'}
Page URL: ${window.location.href}
User Agent: ${navigator.userAgent}
Timestamp: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' })}`,
          gclid: gclid || 'N/A',
          utm_source: utmParams.utm_source || 'N/A',
          utm_campaign: utmParams.utm_campaign || 'N/A'
        },
        emailjsConfig.publicKey
      );

      // Track the form submission
      trackingManager.trackFormSubmission(`unified_${actionType.toLowerCase()}`, leadData);

      // Google Ads Conversion Tracking
      if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
          'send_to': 'AW-16614033926/29hRCIHVqasbEIaUmPI9',
          'value': 0,
          'currency': 'AED',
          'transaction_id': leadData.timestamp,
          'gclid': gclid || localStorage.getItem('gclid')
        });
      }

      // Google Tag Manager DataLayer Event
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          'event': `unified_${actionType.toLowerCase()}_submission`,
          'form_type': `unified_${actionType.toLowerCase()}`,
          'lead_name': formData.name.trim(),
          'lead_phone': formData.phone.trim(),
          'gclid': gclid || localStorage.getItem('gclid'),
          'utm_source': utmParams.utm_source,
          'utm_campaign': utmParams.utm_campaign,
          'conversion_value': 0,
          'timestamp': new Date().toISOString()
        });
      }

      // Meta Pixel Lead Event via GTM
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          event: 'fb_lead',
          content_name: `Unified Widget - ${actionType}`,
          content_category: 'Healthcare',
          value: 0,
          currency: 'AED',
          gclid: gclid || localStorage.getItem('gclid')
        });
      }

      return true;
    } catch (error) {
      console.error('Error submitting lead data:', error);
      toast({
        title: 'Submission Error',
        description: 'An error occurred while submitting your data. Please try again.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async () => {
    const success = await submitLeadData('Form Submit');
    if (success) {
      toast({
        title: 'Booking Successful',
        description: 'Thank you! We will contact you soon to confirm your free session.',
        variant: 'default'
      });
      setIsOpen(false);
      setFormData({ name: '', phone: '' });
    }
  };

  const handleWhatsAppSubmit = async () => {
    const success = await submitLeadData('WhatsApp');
    if (success) {
      const message = `Hello, my name is ${formData.name.trim()} and my phone number is ${formData.phone.trim()}. I would like to inquire about physiotherapy treatment.`;
      const whatsappUrl = `https://wa.me/971507547326?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      setIsOpen(false);
      setFormData({ name: '', phone: '' });
    }
  };

  const handleCallSubmit = async () => {
    const success = await submitLeadData('Call');
    if (success) {
      window.location.href = 'tel:+971507547326';
      setIsOpen(false);
      setFormData({ name: '', phone: '' });
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="px-4 py-3 sm:px-6 sm:py-4 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-105 border-2 border-teal-400 hover:border-teal-300 flex items-center gap-2 sm:gap-3 font-bold text-sm sm:text-lg whitespace-nowrap"
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="hidden sm:inline">Book Free Session</span>
          <span className="sm:hidden">Book Free</span>
        </Button>
      </motion.div>

      {/* Widget Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-[100] flex items-end justify-end p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-white rounded-2xl w-full max-w-sm mr-4 mb-4 p-6 shadow-2xl"
              initial={{ y: '100%', x: '100%' }}
              animate={{ y: 0, x: 0 }}
              exit={{ y: '100%', x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Book Your Free Session
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Form */}
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    className={`mt-1 ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+971 50 123 4567"
                    required
                    className={`mt-1 ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
                    style={{ direction: 'ltr', textAlign: 'left' }}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <Button
                    type="button"
                    onClick={handleFormSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-3 font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Submitting...' : 'Book Free Session'}
                  </Button>

                  <Button
                    type="button"
                    onClick={handleWhatsAppSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Submitting...' : 'WhatsApp'}
                  </Button>

                  <Button
                    type="button"
                    onClick={handleCallSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Submitting...' : 'Call Us'}
                  </Button>
                </div>

                {/* Privacy Note */}
                <div className="bg-blue-50 p-3 rounded-lg mt-4">
                  <p className="text-xs text-blue-800">
                    <strong>Note:</strong> We respect your privacy; your information is confidential and protected.
                  </p>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UnifiedContactWidget;

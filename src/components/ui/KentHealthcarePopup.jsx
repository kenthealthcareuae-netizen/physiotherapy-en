import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { X, Clock, Shield } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useConfig } from '@/contexts/ConfigContext';

const KentHealthcarePopup = () => {
  const { toast } = useToast();
  const { emailjsConfig } = useConfig();
  
  // State management
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    problem: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasShownInitial, setHasShownInitial] = useState(false);
  const [hasShownExit, setHasShownExit] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [scrollDepth, setScrollDepth] = useState(0);

  // Constants
  const DELAY_TIME = 15000; // 15 seconds
  const SCROLL_TRIGGER = 0.3; // 30% scroll depth
  const EXIT_INTENT_THRESHOLD = 10; // pixels from top
  const STORAGE_KEYS = {
    INITIAL_SHOWN: 'khPopupShownInitial_en',
    DISMISSED: 'khPopupDismissed_en',
    EXIT_SHOWN: 'khPopupExitShown_en'
  };

  // Check session storage on mount
  useEffect(() => {
    const initialShown = sessionStorage.getItem(STORAGE_KEYS.INITIAL_SHOWN) === 'true';
    const dismissed = sessionStorage.getItem(STORAGE_KEYS.DISMISSED) === 'true';
    const exitShown = sessionStorage.getItem(STORAGE_KEYS.EXIT_SHOWN) === 'true';
    
    setHasShownInitial(initialShown);
    setIsDismissed(dismissed);
    setHasShownExit(exitShown);
  }, []);

  // Engagement triggers (time + scroll)
  useEffect(() => {
    if (hasShownInitial || isDismissed) return;

    const timer = setTimeout(() => {
      if (!hasShownInitial && !isDismissed) {
        showPopup();
        setHasShownInitial(true);
        sessionStorage.setItem(STORAGE_KEYS.INITIAL_SHOWN, 'true');
      }
    }, DELAY_TIME);

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      
      setScrollDepth(scrollPercent);
      
      if (scrollPercent >= SCROLL_TRIGGER && !hasShownInitial && !isDismissed) {
        clearTimeout(timer);
        showPopup();
        setHasShownInitial(true);
        sessionStorage.setItem(STORAGE_KEYS.INITIAL_SHOWN, 'true');
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasShownInitial, isDismissed]);

  // Desktop exit-intent detection
  useEffect(() => {
    if (!isDismissed || hasShownExit) return;

    const handleMouseLeave = (event) => {
      if (event.clientY <= EXIT_INTENT_THRESHOLD) {
        showPopup();
        setHasShownExit(true);
        sessionStorage.setItem(STORAGE_KEYS.EXIT_SHOWN, 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDismissed, hasShownExit]);

  // Mobile back-button exit-intent with History API
  useEffect(() => {
    let isInitialized = false;

    const initializeHistoryAPI = () => {
      if (!isInitialized) {
        window.history.pushState({ popupIntercepted: true }, '', window.location.href);
        isInitialized = true;
      }
    };

    const handlePopState = (event) => {
      if (isDismissed && !hasShownExit) {
        showPopup();
        setHasShownExit(true);
        sessionStorage.setItem(STORAGE_KEYS.EXIT_SHOWN, 'true');
        window.history.pushState({ popupIntercepted: true }, '', window.location.href);
      }
    };

    initializeHistoryAPI();
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isDismissed, hasShownExit]);

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      if (window.history.state && window.history.state.popupIntercepted) {
        window.history.back();
      }
    };
  }, []);

  const showPopup = () => {
    setIsVisible(true);
  };

  const hidePopup = () => {
    setIsVisible(false);
    
    // Only mark as dismissed if it's the initial popup
    if (!hasShownExit) {
      setIsDismissed(true);
      sessionStorage.setItem(STORAGE_KEYS.DISMISSED, 'true');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast({
        title: 'Missing Information',
        description: 'Name and phone number are required',
        variant: 'destructive'
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
          email: 'N/A - Popup Form',
          subject: 'Lead from English Physiotherapy Popup Form',
          message: `FORM METHOD: English Physiotherapy Popup\n\nLEAD DETAILS:\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: N/A - Popup Form\nMessage: ${formData.problem || 'N/A'}\n\nPAGE INFO:\nLanguage: English\nPage Type: Physiotherapy Landing Page (English)\nPage URL: ${window.location.href}\n\nTRACKING DATA:\nGCLID: ${gclid || 'N/A'}\nUTM Source: ${utmParams.utm_source || 'N/A'}\nUTM Medium: ${utmParams.utm_medium || 'N/A'}\nUTM Campaign: ${utmParams.utm_campaign || 'N/A'}\nUTM Term: ${utmParams.utm_term || 'N/A'}\nUTM Content: ${utmParams.utm_content || 'N/A'}\nUser Agent: ${navigator.userAgent}\nTimestamp: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' })}`,
          gclid: gclid || 'N/A',
          utm_source: utmParams.utm_source || 'N/A',
          utm_campaign: utmParams.utm_campaign || 'N/A'
        },
        emailjsConfig.publicKey
      );

      // Track conversion
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          'event': 'popup_form_submission',
          'form_type': 'popup_form',
          'lead_name': formData.name,
          'lead_phone': formData.phone,
          'lead_email': 'N/A',
          'gclid': gclid || localStorage.getItem('gclid'),
          'utm_source': utmParams.utm_source,
          'utm_campaign': utmParams.utm_campaign,
          'conversion_value': 0,
          'timestamp': new Date().toISOString()
        });
      }

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

      // Meta Pixel Lead Event
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          event: 'fb_lead',
          content_name: 'Popup Form Submission',
          content_category: 'Healthcare',
          value: 0,
          currency: 'AED',
          gclid: gclid || localStorage.getItem('gclid')
        });
      }

      toast({
        title: 'Request Submitted Successfully!',
        description: 'We will contact you soon',
        variant: 'default'
      });

      // Hide popup and prevent all future popups
      setIsVisible(false);
      setIsDismissed(true);
      setHasShownExit(true);
      sessionStorage.setItem(STORAGE_KEYS.DISMISSED, 'true');
      sessionStorage.setItem(STORAGE_KEYS.EXIT_SHOWN, 'true');

      // Redirect to thank you page
      setTimeout(() => {
        window.location.href = emailjsConfig.redirectUrl;
      }, 1500);

    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: 'Submission Error',
        description: 'Please try again',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
          >
            {/* Close Button */}
            <button
              onClick={hidePopup}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Get Your FREE Physiotherapy Session
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Comprehensive assessment and personalized treatment plan – no obligations
              </p>
              
              {/* 3-Day Countdown Label */}
              <div className="flex items-center justify-center gap-2 text-sm text-teal-600 font-medium">
                <Clock className="h-4 w-4" />
                <span>Offer expires in: 72 hours</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                name="name"
                placeholder="Your Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="text-left"
              />
              
              <Input
                type="tel"
                name="phone"
                placeholder="Your Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="text-left"
              />
              
              <Textarea
                name="problem"
                placeholder="Optional – Tell us about your health concern if you'd like"
                value={formData.problem}
                onChange={handleInputChange}
                rows={3}
                className="text-left resize-none"
              />

              {/* Privacy Assurance */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Shield className="h-3 w-3" />
                <span>We respect your privacy; your information is confidential</span>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-3 font-medium"
              >
                {isSubmitting ? 'Submitting...' : 'Book Now'}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KentHealthcarePopup;

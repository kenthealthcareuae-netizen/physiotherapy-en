import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { X, Gift, Star, Heart, Sparkles } from 'lucide-react';
import trackingManager from '@/utils/tracking';
import emailjs from '@emailjs/browser';
import { useConfig } from '@/contexts/ConfigContext';

const FreeSessionModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    problem: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { emailjsConfig } = useConfig();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      const body = document.body;
      const html = document.documentElement;
      
      // Prevent scrolling
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
      body.style.overflow = 'hidden';
      body.style.height = '100%';
      html.style.overflow = 'hidden';
      html.style.height = '100%';
      
      // Prevent touch scrolling on mobile
      body.style.touchAction = 'none';
      html.style.touchAction = 'none';
      
      // Store scroll position for restoration
      body.setAttribute('data-scroll-y', scrollY.toString());
      
      return () => {
        // Restore scrolling
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
        
        // Restore scroll position
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim() || !formData.problem.trim()) {
      toast({
        title: 'Please fill all fields',
        description: 'Name, phone number, and problem description are required',
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

      // Prepare data for both EmailJS and Google Sheets
      const leadData = {
        timestamp: new Date().toISOString(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        problem: formData.problem.trim(),
        gclid: gclid,
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
        utm_term: utmParams.utm_term,
        utm_content: utmParams.utm_content,
        source: 'Free Session Popup',
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
          subject: 'Free Session Request - English Physiotherapy Page',
          message: `FORM METHOD: English Physiotherapy Free Session Popup

LEAD DETAILS:
Name: ${formData.name.trim()}
Phone: ${formData.phone.trim()}
Problem: ${formData.problem.trim()}

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

      // Track the form submission
      trackingManager.trackFormSubmission('free_session_popup', leadData);

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
          'event': 'free_session_form_submission',
          'form_type': 'free_session_popup',
          'lead_name': formData.name.trim(),
          'lead_phone': formData.phone.trim(),
          'lead_problem': formData.problem.trim(),
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
          content_name: 'Free Session Form Submission',
          content_category: 'Healthcare',
          value: 0,
          currency: 'AED',
          gclid: gclid || localStorage.getItem('gclid')
        });
      }

      // Submit to Google Sheets via proxy (async, non-blocking)
      submitToGoogleSheets(leadData).catch(error => {
        console.log('Google Sheets submission failed:', error);
      });

      // Show success message
      toast({
        title: '🎉 Registration Successful!',
        description: 'We will contact you within 24 hours to book your free session'
      });

      // Redirect to thank you page after success
      setTimeout(() => {
        onClose();
        setFormData({ name: '', phone: '', problem: '' });
        window.location.href = emailjsConfig.redirectUrl;
      }, 1000);

    } catch (error) {
      console.error('Error submitting free session form:', error);
      toast({
        title: 'Submission Error',
        description: 'Please try again',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitToGoogleSheets = async (data) => {
    // Use PHP proxy to bypass CORS issues
    const PROXY_URL = '/php-proxy.php';
    
    try {
      console.log('📤 Sending data to Google Sheets via proxy:', data);
      
      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      console.log('📥 Google Sheets response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Google Sheets error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Google Sheets success:', result);
      return result;
    } catch (error) {
      console.error('❌ Error submitting to Google Sheets:', error);
      // Don't throw error - we still want to show success even if Google Sheets fails
      // But log the error for debugging
      console.log('🔍 Full error details:', {
        message: error.message,
        stack: error.stack,
        data: data
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      style={{
        animation: 'modalFadeIn 0.3s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative overflow-hidden" 
        dir="ltr"
        style={{
          animation: 'modalSlideIn 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-green-100 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-100 to-pink-100 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Free Session! 🎁</h2>
                <p className="text-sm text-gray-600">Get a free consultation</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-gray-800">What you'll get:</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Comprehensive health assessment</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Personalized treatment plan</span>
              </li>
              <li className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-green-500" />
                <span>Free tips and guidance</span>
              </li>
            </ul>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="mt-1"
                dir="ltr"
              />
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
                className="mt-1"
                dir="ltr"
                style={{ direction: 'ltr', textAlign: 'left' }}
              />
            </div>

            <div>
              <Label htmlFor="problem" className="text-sm font-medium text-gray-700">
                What problem are you facing? *
              </Label>
              <Textarea
                id="problem"
                name="problem"
                value={formData.problem}
                onChange={handleInputChange}
                placeholder="Tell us about the health problem you're facing..."
                required
                className="mt-1 min-h-[80px]"
                dir="ltr"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>✨ Guaranteed:</strong> 100% free session with no financial obligations
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Later
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold"
              >
                {isSubmitting ? 'Sending...' : 'Book My Free Session 🎁'}
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes modalFadeIn {
          from { 
            opacity: 0; 
          }
          to { 
            opacity: 1; 
          }
        }
        
        @keyframes modalSlideIn {
          from { 
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        /* Mobile optimizations */
        @media (max-width: 640px) {
          .modal-container {
            padding: 1rem;
          }
          
          .modal-content {
            max-height: 90vh;
            overflow-y: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default FreeSessionModal;

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { X, MessageCircle } from 'lucide-react';
import trackingManager from '@/utils/tracking';
import emailjs from '@emailjs/browser';
import { useConfig } from '@/contexts/ConfigContext';

const WhatsAppModal = ({ isOpen, onClose, phoneNumber = '+971507547326' }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
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
    
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast({
        title: 'Data Error',
        description: 'Please enter your name and phone number',
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
        source: 'WhatsApp Form Gateway',
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
          subject: 'WhatsApp Lead - English Physiotherapy Page',
          message: `FORM METHOD: English Physiotherapy WhatsApp Gateway

LEAD DETAILS:
Name: ${formData.name.trim()}
Phone: ${formData.phone.trim()}

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
      trackingManager.trackFormSubmission('whatsapp_gateway', leadData);

      // Google Ads Conversion Tracking
      if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
          'send_to': 'AW-16614033926/29hRCIHVqasbEIaUmPI9',
          'value': 0, // No fixed value as per user requirement
          'currency': 'AED',
          'transaction_id': leadData.timestamp,
          'gclid': gclid || localStorage.getItem('gclid')
        });
      }

      // Google Tag Manager DataLayer Event
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          'event': 'whatsapp_form_submission',
          'form_type': 'whatsapp_gateway',
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
          content_name: 'WhatsApp Form Submission',
          content_category: 'Healthcare',
          value: 0,
          currency: 'AED',
          gclid: gclid || localStorage.getItem('gclid')
        });
      }

      // Submit to Google Sheets webhook (async, non-blocking)
      submitToGoogleSheets(leadData).catch(error => {
        console.log('Google Sheets submission failed:', error);
      });

      // Show success message
      toast({
        title: 'Data sent successfully',
        description: 'Redirecting you to WhatsApp...'
      });

      // Create WhatsApp message with pre-filled text
      const message = `Hello, I'm ${formData.name.trim()}. I would like to inquire about physiotherapy services.`;
      const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;

      // Close modal and redirect directly to WhatsApp
      setTimeout(() => {
        onClose();
        // Redirect directly to WhatsApp (no popup blockers)
        window.location.href = whatsappUrl;
      }, 1000);

    } catch (error) {
      console.error('Error submitting WhatsApp form:', error);
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
      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting to Google Sheets:', error);
      // Don't throw error - we still want to redirect to WhatsApp even if Google Sheets fails
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
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" 
        dir="ltr"
        style={{
          animation: 'modalSlideIn 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Start WhatsApp Conversation</h2>
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

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> After submitting your data, you will be automatically redirected to WhatsApp to start the conversation.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Sending...' : 'Start Conversation'}
            </Button>
          </div>
        </form>
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

export default WhatsAppModal;

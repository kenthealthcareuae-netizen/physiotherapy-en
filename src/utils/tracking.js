// Enhanced tracking utilities for physiotherapy landing page
class TrackingManager {
  constructor() {
    this.gclid = this.getGCLID();
    this.utmParams = this.getUTMParams();
    this.sessionId = this.generateSessionId();
    this.initializeTracking();
  }

  // Get GCLID from URL parameters
  getGCLID() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('gclid') || urlParams.get('gclsrc') || null;
  }

  // Get UTM parameters
  getUTMParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_term: urlParams.get('utm_term'),
      utm_content: urlParams.get('utm_content')
    };
  }

  // Generate unique session ID
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Initialize tracking
  initializeTracking() {
    // Store GCLID in localStorage for form submissions
    if (this.gclid) {
      localStorage.setItem('gclid', this.gclid);
      localStorage.setItem('gclid_timestamp', Date.now().toString());
    }

    // Track page view with enhanced data
    this.trackPageView();
    
    // Track UTM parameters
    this.trackUTMParams();
  }

  // Enhanced page view tracking
  trackPageView() {
    const trackingData = {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      gclid: this.gclid,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      ...this.utmParams
    };

    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', trackingData);
    }

    // Google Tag Manager
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        event: 'page_view',
        ...trackingData
      });
    }
  }

  // Track UTM parameters
  trackUTMParams() {
    const utmData = this.utmParams;
    const hasUTM = Object.values(utmData).some(value => value !== null);
    
    if (hasUTM) {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'utm_tracking', utmData);
      }
    }
  }

  // Track form submissions
  trackFormSubmission(formType, formData) {
    const trackingData = {
      event_category: 'form_submission',
      event_label: `English_${formType}`,
      page_language: 'English',
      page_type: 'Physiotherapy Landing Page (English)',
      gclid: this.gclid || localStorage.getItem('gclid'),
      session_id: this.sessionId,
      form_data: formData,
      timestamp: new Date().toISOString()
    };

    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_submit', trackingData);
    }

    // Google Tag Manager
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        event: 'form_submission',
        form_type: formType,
        ...trackingData
      });
    }

    // Meta Pixel Lead event via GTM
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        event: 'fb_lead',
        content_name: 'English Physiotherapy Contact Form',
        content_category: 'Healthcare',
        gclid: this.gclid || localStorage.getItem('gclid')
      });
    }

    // Google Ads Conversion
    this.trackConversion('form_submission');
  }

  // Track phone calls
  trackPhoneCall(phoneNumber) {
    const trackingData = {
      event_category: 'phone_call',
      event_label: phoneNumber,
      gclid: this.gclid || localStorage.getItem('gclid'),
      session_id: this.sessionId,
      timestamp: new Date().toISOString()
    };

    if (typeof gtag !== 'undefined') {
      gtag('event', 'phone_call', trackingData);
    }

    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        event: 'phone_call',
        phone_number: phoneNumber,
        ...trackingData
      });
    }

    // Meta Pixel Contact event via GTM
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        event: 'fb_contact',
        content_name: 'Phone Call',
        content_category: 'Healthcare',
        gclid: this.gclid || localStorage.getItem('gclid')
      });
    }

    this.trackConversion('phone_call');
  }

  // Track WhatsApp clicks
  trackWhatsAppClick(phoneNumber) {
    const trackingData = {
      event_category: 'whatsapp_click',
      event_label: phoneNumber,
      gclid: this.gclid || localStorage.getItem('gclid'),
      session_id: this.sessionId,
      timestamp: new Date().toISOString()
    };

    if (typeof gtag !== 'undefined') {
      gtag('event', 'whatsapp_click', trackingData);
    }

    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        event: 'whatsapp_click',
        phone_number: phoneNumber,
        ...trackingData
      });
    }

    // Meta Pixel Contact event via GTM
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        event: 'fb_contact',
        content_name: 'WhatsApp Click',
        content_category: 'Healthcare',
        gclid: this.gclid || localStorage.getItem('gclid')
      });
    }

    this.trackConversion('whatsapp_click');
  }

  // Track button clicks
  trackButtonClick(buttonName, buttonLocation) {
    const trackingData = {
      event_category: 'button_click',
      event_label: buttonName,
      button_location: buttonLocation,
      gclid: this.gclid || localStorage.getItem('gclid'),
      session_id: this.sessionId,
      timestamp: new Date().toISOString()
    };

    if (typeof gtag !== 'undefined') {
      gtag('event', 'button_click', trackingData);
    }

    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        event: 'button_click',
        button_name: buttonName,
        button_location: buttonLocation,
        ...trackingData
      });
    }
  }

  // Track conversions
  trackConversion(conversionType) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        send_to: 'AW-16614033926/29hRCIHVqasbEIaUmPI9',
        conversion_type: conversionType,
        gclid: this.gclid || localStorage.getItem('gclid')
      });
    }
  }

  // Track scroll depth
  trackScrollDepth() {
    let maxScroll = 0;
    const scrollThresholds = [25, 50, 75, 90, 100];
    const trackedThresholds = new Set();

    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        scrollThresholds.forEach(threshold => {
          if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
            trackedThresholds.add(threshold);
            
            if (typeof gtag !== 'undefined') {
              gtag('event', 'scroll', {
                event_category: 'engagement',
                event_label: `${threshold}%`,
                value: threshold
              });
            }
          }
        });
      }
    });
  }

  // Track time on page
  trackTimeOnPage() {
    const startTime = Date.now();
    
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      
      if (typeof gtag !== 'undefined') {
        gtag('event', 'timing_complete', {
          name: 'time_on_page',
          value: timeOnPage
        });
      }
    });
  }
}

// Initialize tracking
const trackingManager = new TrackingManager();

// Track scroll depth
trackingManager.trackScrollDepth();

// Track time on page
trackingManager.trackTimeOnPage();

export default trackingManager;

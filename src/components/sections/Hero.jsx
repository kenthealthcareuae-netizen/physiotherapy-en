import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea as ShadcnTextarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import emailjs from '@emailjs/browser';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowRight, PhoneCall } from 'lucide-react';
import { useConfig } from '@/contexts/ConfigContext';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import FreeSessionModal from '@/components/ui/FreeSessionModal';
import UnifiedContactWidget from '@/components/ui/UnifiedContactWidget';

// WhatsApp SVG
const WhatsappSVG = props => (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="currentColor" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
  </svg>
);

const HERO_WA   = 'https://wa.me/971507547326';
const HERO_CALL = 'tel:+971507547326';

// Plain form content (no motion)
function QuickBookingFormContent({ onBack }) {
  const { toast } = useToast()
  const { emailjsConfig } = useConfig()
  const [formData, setFormData] = useState({ name:'', phone:'', email:'', message:'' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const handleChange = e => {
    const { id, value } = e.target
    setFormData(p => ({ ...p, [id]: value }))
  }
  const handleNextStep = async () => {
    if (formData.name && formData.phone) {
      // Auto-send the lead data when they complete Step 1
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
          emailjsConfig.serviceId, emailjsConfig.templateId,
          { 
            from_name: formData.name, 
            phone: formData.phone,
            email: 'N/A - Step 1 Only',
            subject: 'Lead from English Physiotherapy Hero Form - Step 1 Complete',
            message: `FORM METHOD: English Physiotherapy Hero Quick Booking - Step 1 Complete

LEAD DETAILS:
Name: ${formData.name}
Phone: ${formData.phone}
Email: N/A - User completed Step 1 only
Message: N/A - User completed Step 1 only

STATUS: Partial Lead - Completed Step 1, proceeding to Step 2

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

        // Track as partial conversion
        if (typeof dataLayer !== 'undefined') {
          dataLayer.push({
            'event': 'partial_lead_capture',
            'form_type': 'hero_step1_complete',
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

        // Google Ads Conversion Tracking for Step 1
        if (typeof gtag !== 'undefined') {
          gtag('event', 'conversion', {
            'send_to': 'AW-16614033926/29hRCIHVqasbEIaUmPI9',
            'value': 0,
            'currency': 'AED',
            'transaction_id': new Date().toISOString(),
            'gclid': gclid || localStorage.getItem('gclid')
          });
        }

        // Meta Pixel Lead Event for Step 1
        if (typeof dataLayer !== 'undefined') {
          dataLayer.push({
            event: 'fb_lead',
            content_name: 'Hero Form Step 1 Complete',
            content_category: 'Healthcare',
            value: 0,
            currency: 'AED',
            gclid: gclid || localStorage.getItem('gclid')
          });
        }

        console.log('Step 1 lead auto-saved successfully');
      } catch (error) {
        console.error('Auto-save error:', error);
      }

      setCurrentStep(2);
    } else {
      toast({ title:'Missing Information', description:'Name and phone number are required.', variant:'destructive' })
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!formData.name || !formData.phone) {
      toast({ title:'Submission Error', description:'Name and phone required.', variant:'destructive' })
      return
    }
    setIsSubmitting(true)
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
        emailjsConfig.serviceId, emailjsConfig.templateId,
        { 
          from_name: formData.name, 
          phone: formData.phone,
          email: formData.email||'N/A',
          subject:'Lead from English Physiotherapy Hero Form',
          message: `FORM METHOD: English Physiotherapy Hero Quick Booking

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
      )

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
          'event': 'hero_form_submission',
          'form_type': 'hero_quick_booking',
          'lead_name': formData.name,
          'lead_phone': formData.phone,
          'lead_email': formData.email || 'N/A',
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
          content_name: 'Hero Form Submission',
          content_category: 'Healthcare',
          value: 0,
          currency: 'AED',
          gclid: gclid || localStorage.getItem('gclid')
        });
      }

      toast({ title:'Request Received', description:'Redirecting to thank you page...' })
      setFormData({ name:'', phone:'', email:'', message:'' })
      setTimeout(() => {
        window.location.href = emailjsConfig.redirectUrl;
      }, 800);
    } catch (error) {
      console.error('Hero form submission error:', error);
      toast({ 
        title:'Error', 
        description:`Failed to send: ${error.message || 'Unknown error'}. Please try again.`, 
        variant:'destructive' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 p-6 bg-card rounded-lg shadow-xl border border-primary/10">
      <Button variant="ghost" size="sm" className="mb-4 font-bold uppercase tracking-wide" onClick={onBack}>
        ← Back
      </Button>
      <h3 className="text-2xl font-semibold text-primary" dir="ltr">Quick Booking Form</h3>
      
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            currentStep >= 1 ? 'bg-teal-500 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            1
          </div>
          <div className={`w-16 h-1 ${
            currentStep >= 2 ? 'bg-teal-500' : 'bg-gray-300'
          }`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            currentStep >= 2 ? 'bg-teal-500 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            2
          </div>
        </div>
      </div>

      {/* Privacy Note */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-4">
        <p className="text-sm text-teal-700 text-center">
          🔒 We respect your privacy – all information is confidential and protected
        </p>
      </div>

      {currentStep === 1 ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="block text-sm mb-1" dir="ltr">Full Name*</Label>
            <Input id="name" value={formData.name} onChange={handleChange} placeholder="e.g. John Smith" dir="ltr" required disabled={isSubmitting}/>
          </div>
          <div>
            <Label htmlFor="phone" className="block text-sm mb-1" dir="ltr">Phone Number*</Label>
            <Input id="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. +971501234567" dir="ltr" style={{ direction: 'ltr', textAlign: 'left' }} required disabled={isSubmitting}/>
          </div>
          <Button
            type="button"
            size="lg"
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-3 font-bold uppercase tracking-wide"
            onClick={handleNextStep}
            disabled={isSubmitting}
          >
            Continue to Step 2
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="block text-sm mb-1" dir="ltr">Email (Optional)</Label>
            <Input id="email" value={formData.email} onChange={handleChange} placeholder="e.g. example@mail.com" dir="ltr" disabled={isSubmitting}/>
          </div>
          <div>
            <Label htmlFor="message" className="block text-sm mb-1" dir="ltr">Additional Message (Optional)</Label>
            <ShadcnTextarea id="message" value={formData.message} onChange={handleChange} placeholder="Any preferences or questions?" dir="ltr" rows={3} disabled={isSubmitting}/>
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-3 font-bold uppercase tracking-wide"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Submit Booking'}
          </Button>
        </form>
      )}
    </div>
  )
}

export default function HeroSection() {
  const [showForm, setShowForm] = useState(false)
  const imgRef = useRef(null)
  const { images } = useConfig()

  // parallax / tilt
  const mouseX = useMotionValue(0), mouseY = useMotionValue(0)
  const cfg = { stiffness:150, damping:20, mass:1 }
  const rotateX = useSpring(useTransform(mouseY,[-0.5,0.5],['10deg','-10deg']),cfg)
  const rotateY = useSpring(useTransform(mouseX,[-0.5,0.5],['-10deg','10deg']),cfg)
  const scale   = useSpring(1,cfg)

  const handleMouseMove = e => {
    const rect = imgRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX-rect.left-rect.width/2)/(rect.width/2))
    mouseY.set((e.clientY-rect.top-rect.height/2)/(rect.height/2))
    scale.set(1.05)
  }
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); scale.set(1) }


  return (
    <>
      <section
        className="relative flex items-center overflow-hidden py-12 md:py-20 bg-gradient-to-br from-background via-primary/5 to-background"
        style={{ minHeight:'calc(100vh-140px)', perspective:'1200px' }}
      >
        {/* Decorative blobs omitted */}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left: static hero image */}
            <div className="lg:col-span-5 mt-10 lg:mt-0" dir="ltr">
              <motion.div
                ref={imgRef}
                className="aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-background mx-auto max-w-md lg:max-w-none"
                initial={{ opacity:0, scale:0.8 }}
                animate={{ opacity:1, scale:1 }}
                transition={{ type:'spring', stiffness:50, damping:12, duration:1, delay:0.4 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ transformStyle:'preserve-3d', rotateX, rotateY, scale }}
              >
                <img
                  src={images.heroImage}
                  alt="Physiotherapy session"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
            </div>

            {/* Right: copy ↔ form toggle */}
            <div className="lg:col-span-7" dir="ltr">
              <AnimatePresence mode="wait">
                {showForm ? (
                  <motion.div
                    key="form"
                    initial={{ x:-50, opacity:0 }}
                    animate={{ x:0, opacity:1 }}
                    exit={{ x:-50, opacity:0 }}
                    transition={{ duration:0.4 }}
                  >
                    <QuickBookingFormContent onBack={() => setShowForm(false)}/>
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={{
                      hidden:{ opacity:0, y:50 },
                      visible:{ opacity:1, y:0, transition:{ type:'spring', stiffness:80, damping:15, delay:0.2 } },
                      exit:{ opacity:0, y:50, transition:{ duration:0.3 } }
                    }}
                  >
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-8 text-center lg:text-left" dir="ltr">
                      <span className="block text-primary">Regain Your Independence & Confidence</span>
                      <span className="block gradient-text-alt">With Specialized Physiotherapy</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto lg:ml-0 leading-relaxed" dir="ltr">
                      At Kent Healthcare, we provide advanced physiotherapy services for movement restoration, rehabilitation, pain management, and improved quality of life for patients of all ages.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start mb-10" dir="ltr">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-8 sm:px-12 py-5 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 font-bold uppercase tracking-wide w-full sm:w-auto text-lg border-2 border-teal-400 hover:border-teal-300"
                        onClick={() => setShowForm(true)}
                      >
                        <ArrowRight className="mr-3 h-6 w-6"/> Book Your Free Session
                      </Button>
                      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <WhatsAppButton 
                          size="lg" 
                          variant="outline"
                          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-6 sm:px-8 py-4 transition-all duration-300 hover:scale-105 font-bold uppercase tracking-wide shadow-lg hover:shadow-xl w-full sm:w-auto"
                          phoneNumber="+971507547326"
                        >
                          <WhatsappSVG className="w-5 h-5 ml-3"/>
                          WhatsApp
                        </WhatsAppButton>
                        <Button size="lg" variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-6 sm:px-8 py-4 transition-all duration-300 hover:scale-105 font-bold uppercase tracking-wide shadow-lg hover:shadow-xl w-full sm:w-auto" asChild>
                          <a href={HERO_CALL}>
                            <PhoneCall className="w-5 h-5 ml-3"/>
                            Call Us
                          </a>
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col items-center lg:items-start mt-8">
                      <div className="animate-bounce mb-4">
                        <ArrowRight className="h-6 w-6 text-teal-500 rotate-90" />
                      </div>
                      <Button size="md" variant="ghost" className="text-teal-600 hover:text-teal-700 underline font-bold uppercase tracking-wide" asChild>
                        <a href="#services" dir="ltr">Discover More ↓</a>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Unified Contact Widget */}
      {/* <UnifiedContactWidget /> */}

    </>
  )
}

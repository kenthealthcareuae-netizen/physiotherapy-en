import React, { createContext, useContext, useState, useEffect } from 'react';

const ConfigContext = createContext();

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

export const ConfigProvider = ({ children }) => {
  const [emailjsConfig, setEmailjsConfig] = useState({
    serviceId: 'service_1u1ojng',
    templateId: 'template_iddt97m',
    publicKey: '0ZTiNdXEEo7wUuNEh',
    redirectUrl: 'https://kenthealthcare.ae/thankyou/'
  });

  const [images, setImages] = useState({
    heroImage: 'https://res.cloudinary.com/du2afeuwp/image/upload/v1760219139/DSC05032_oh0ekm.webp?v=2.2',
    conditionsImage: 'https://res.cloudinary.com/du2afeuwp/image/upload/v1760199550/7_t2xmbq.webp',
    logoUrl: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/5b3275a5-654f-4513-a76d-2e58b21dc210/0ecae4226280d42f42e60b2d942f65b3.png',
    version: 'v2.2' // Force cache refresh
  });

  const [trackingCodes, setTrackingCodes] = useState({
    googleAnalytics: '',
    googleTagManager: '',
    facebookPixel: '',
    gclid: '',
    utmSource: '',
    utmMedium: '',
    utmCampaign: ''
  });

  const [customCss, setCustomCss] = useState('');
  const [customJs, setCustomJs] = useState('');

  useEffect(() => {
    // Load configurations from localStorage
    const savedEmailjs = localStorage.getItem('admin-emailjs');
    const savedImages = localStorage.getItem('admin-images');
    const savedTracking = localStorage.getItem('admin-tracking');
    const savedCss = localStorage.getItem('admin-css');
    const savedJs = localStorage.getItem('admin-js');

    if (savedEmailjs) setEmailjsConfig(JSON.parse(savedEmailjs));
    
    // Check if saved images have the new version, if not use default
    if (savedImages) {
      const parsedImages = JSON.parse(savedImages);
      if (parsedImages.version !== 'v2.2') {
        // Clear old cache and use new images
        localStorage.removeItem('admin-images');
        console.log('🔄 Image cache cleared - showing new images');
      } else {
        setImages(parsedImages);
      }
    }
    
    if (savedTracking) setTrackingCodes(JSON.parse(savedTracking));
    if (savedCss) setCustomCss(savedCss);
    if (savedJs) setCustomJs(savedJs);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('admin-emailjs', JSON.stringify(emailjsConfig));
  }, [emailjsConfig]);

  useEffect(() => {
    localStorage.setItem('admin-images', JSON.stringify(images));
  }, [images]);

  useEffect(() => {
    localStorage.setItem('admin-tracking', JSON.stringify(trackingCodes));
  }, [trackingCodes]);

  useEffect(() => {
    localStorage.setItem('admin-css', customCss);
  }, [customCss]);

  useEffect(() => {
    localStorage.setItem('admin-js', customJs);
  }, [customJs]);

  const value = {
    emailjsConfig,
    setEmailjsConfig,
    images,
    setImages,
    trackingCodes,
    setTrackingCodes,
    customCss,
    setCustomCss,
    customJs,
    setCustomJs
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};

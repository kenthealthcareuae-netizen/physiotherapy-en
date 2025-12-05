import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import WhatsAppModal from './WhatsAppModal';
import trackingManager from '@/utils/tracking';

const WhatsAppButton = ({ 
  phoneNumber = '+971507547326',
  className = '',
  children,
  variant = 'default',
  size = 'default',
  ...props 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    // Track WhatsApp button click
    trackingManager.trackButtonClick('whatsapp_gateway', 'whatsapp_button');
    
    // Open the form modal instead of direct WhatsApp link
    setIsModalOpen(true);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        className={className}
        variant={variant}
        size={size}
        {...props}
      >
        {children || (
          <>
            <MessageCircle className="w-4 h-4 ml-2" />
            Chat with us on WhatsApp
          </>
        )}
      </Button>

      <WhatsAppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        phoneNumber={phoneNumber}
      />
    </>
  );
};

export default WhatsAppButton;

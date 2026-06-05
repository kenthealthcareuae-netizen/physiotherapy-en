import { Phone } from 'lucide-react';
import { motion } from 'framer-motion';


const WhatsappSVG = (props) => (
  <svg
    viewBox="0 0 32 32"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M16.004 3C8.82 3 3 8.82 3 16.004c0 2.29.6 4.53 1.74 6.51L3 29l6.67-1.71a13 13 0 0 0 6.334 1.618H16c7.184 0 13.004-5.82 13.004-13.004S23.184 3 16.004 3zm0 23.87a10.8 10.8 0 0 1-5.49-1.5l-.39-.23-3.96 1.02 1.06-3.86-.25-.4a10.82 10.82 0 1 1 9.03 4.97zm5.93-8.11c-.32-.16-1.89-.93-2.18-1.03-.29-.11-.5-.16-.71.16-.21.31-.82 1.03-1 1.24-.18.21-.36.24-.68.08-.32-.16-1.34-.49-2.55-1.56-.94-.84-1.58-1.88-1.77-2.2-.18-.32-.02-.49.14-.65.15-.15.32-.39.48-.58.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.72-.97-2.35-.26-.63-.53-.54-.72-.55h-.61c-.21 0-.55.08-.84.4-.29.32-1.11 1.09-1.11 2.66s1.14 3.08 1.3 3.29c.16.21 2.24 3.42 5.43 4.8.76.33 1.35.53 1.81.67.76.24 1.45.21 2 .13.61-.09 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37z" />
  </svg>
);


export default function FloatingContactButtons() {
  return (
    <div className="fixed bottom-28 right-6 z-50 flex flex-col gap-4">
      {/* WhatsApp */}
      <motion.a
        href="https://wa.me/971507128370"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-xl hover:bg-green-600 transition-colors"
      >
        <WhatsappSVG className="w-7 h-7" />
      </motion.a>

      {/* Call */}
      <motion.a
        href="tel:+971507128370"
        aria-label="Call Us"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-xl hover:bg-blue-600 transition-colors"
      >
        <Phone size={26} />
      </motion.a>
    </div>
  );
}

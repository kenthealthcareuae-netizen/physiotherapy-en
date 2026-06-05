import { Phone, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FloatingContactButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {/* WhatsApp */}
      <motion.a
        href="https://wa.me/971507547326"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-xl hover:bg-green-600 transition-colors"
      >
        <MessageCircle size={26} />
      </motion.a>

      {/* Call */}
      <motion.a
        href="tel:+971507547326"
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

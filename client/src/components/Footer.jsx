import React from 'react';
import { Leaf } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-100 mt-auto py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <Leaf className="h-5 w-5 text-emerald-600" />
            <span className="font-display font-bold text-neutral-800">Prakriti+</span>
            <span className="text-xs text-neutral-400">| Seasonal Wellness Advisory</span>
          </div>
          <div className="text-center md:text-right max-w-md">
            <p className="text-xs text-neutral-400 leading-normal">
              Disclaimer: The recommendations provided by this system are based on traditional Ayurvedic principles (Indian Knowledge Systems) and are intended for educational and wellness guidance only. They do not constitute medical advice.
            </p>
          </div>
        </div>
        <div className="border-t border-neutral-50 mt-6 pt-4 flex flex-col sm:flex-row justify-between items-center text-[11px] text-neutral-400">
          <p>© {new Date().getFullYear()} Prakriti+. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


import React from 'react';

interface HeaderProps {
  onClose: () => void;
}

const Header: React.FC<HeaderProps> = ({ onClose }) => {
  return (
    <header className="px-6 py-6 flex items-center justify-between border-b border-zinc-800 bg-[#0c0c0c] sticky top-0 z-50">
      <div className="flex flex-col">
        <img 
          src="https://wimprins.nl/assets/uploads/logos/logo-wim-prins.svg" 
          alt="Wim Prins" 
          className="h-5 w-auto object-contain block brightness-0 invert" 
        />
        <div className="flex items-center gap-1.5 mt-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-heading text-[10px] text-zinc-500 font-bold tracking-[0.15em] uppercase">Exclusief Advies</span>
        </div>
      </div>
      
      <button 
        onClick={onClose}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-white"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </header>
  );
};

export default Header;

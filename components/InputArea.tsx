
import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface InputAreaProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; 
      const scrollHeight = textarea.scrollHeight;
      // Maximaal 120px hoogte, maar start op een natuurlijke hoogte voor 1 regel
      textarea.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-6 pb-8 pt-2">
      <div className="flex items-center bg-zinc-900/40 border border-zinc-800/80 rounded-[32px] px-6 min-h-[64px] focus-within:bg-zinc-900 focus-within:border-[#c9a96e]/30 focus-within:ring-4 focus-within:ring-[#c9a96e]/5 transition-all duration-300 shadow-sm overflow-hidden">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Stel uw vraag..."
          className="flex-1 bg-transparent text-[15px] text-white focus:outline-none resize-none py-[19px] h-auto max-h-[120px] no-scrollbar placeholder:text-zinc-600 font-medium leading-[22px] block"
          rows={1}
          disabled={disabled}
          style={{ 
            boxSizing: 'border-box',
            outline: 'none',
            display: 'flex',
            alignItems: 'center'
          }}
        />
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#c9a96e", color: "#000" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          className="ml-3 w-11 h-11 flex items-center justify-center bg-zinc-800 text-[#c9a96e] rounded-full disabled:opacity-5 transition-all shrink-0 shadow-lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l7-7-7-7M5 12h14" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
};

export default InputArea;


import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message, Car, UserData } from '../types';
import { STOCK } from '../constants';
import CarCard from './CarCard';
import LeadForm from './LeadForm';

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
  userName?: string;
  showForm: boolean;
  onFormSubmit: (data: UserData) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isTyping, userName, showForm, onFormSubmit }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping, showForm]);

  const parseMessage = (text: string) => {
    const idRegex = /\[CAR_IDS:\s*([^\]]+)\]/i;
    const match = text.match(idRegex);
    let cars: Car[] = [];
    if (match) {
      const ids = match[1].split(',').map(id => id.trim());
      cars = STOCK.filter(car => ids.includes(car.id));
      const parts = text.split(idRegex);
      return { intro: parts[0]?.trim(), outro: parts[2]?.trim(), cars };
    }
    return { intro: text, outro: null, cars: [] };
  };

  return (
    <div 
      ref={containerRef} 
      className="flex-1 overflow-y-auto px-6 py-8 space-y-12 no-scrollbar overflow-x-hidden bg-[#0c0c0c]"
    >
      <AnimatePresence initial={false}>
        {messages.map((msg) => {
          const { intro, outro, cars } = parseMessage(msg.text);
          const isUser = msg.role === 'user';
          
          return (
            <motion.div 
              key={msg.id} 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col gap-3 ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 opacity-30 px-1">
                <span className="font-heading text-[9px] font-bold tracking-[0.25em] uppercase text-zinc-500">
                  {isUser ? (userName || 'Klant') : 'Prins Adviseur'}
                </span>
              </div>

              <div className={`max-w-[92%] px-6 py-4 rounded-[26px] text-[15px] leading-relaxed shadow-sm ${
                isUser 
                  ? 'bg-[#c9a96e] text-black font-medium rounded-tr-none' 
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none'
              }`}>
                {intro.split(/(\*\*.*?\*\*)/g).map((part, i) => 
                  part.startsWith('**') ? <strong key={i} className={isUser ? "font-bold text-black" : "text-[#c9a96e] font-bold"}>{part.slice(2, -2)}</strong> : part
                )}
              </div>

              {!isUser && cars.length > 0 && (
                <div className="relative w-full overflow-visible py-2">
                  {/* Gebruik padding op de carrousel zelf en snap-start op de kaarten */}
                  <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-6 px-6">
                    {cars.map(car => <CarCard key={car.id} car={car} />)}
                    {/* Extra lege ruimte aan het einde voor betere scroll ervaring */}
                    <div className="min-w-[20px] h-1 shrink-0" />
                  </div>
                </div>
              )}

              {!isUser && outro && (
                <div className="max-w-[85%] border-l-2 border-[#c9a96e]/30 pl-5 py-2 mt-1">
                  <div className="text-[14px] text-zinc-500 font-medium leading-relaxed italic">
                    {outro}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {showForm && (
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <LeadForm onSubmit={onFormSubmit} />
        </motion.div>
      )}

      {isTyping && (
        <div className="flex items-center gap-3 px-1 py-4">
           <div className="flex gap-2">
             {[0, 0.2, 0.4].map((delay) => (
               <motion.div 
                 key={delay}
                 animate={{ opacity: [0.1, 1, 0.1], scale: [0.9, 1.1, 0.9] }} 
                 transition={{ repeat: Infinity, duration: 1.5, delay }} 
                 className="w-1.5 h-1.5 bg-[#c9a96e] rounded-full" 
               />
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;

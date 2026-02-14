
import React from 'react';
import { motion } from 'framer-motion';
import { Car } from '../types';

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <motion.a 
      href={car.url} 
      target="_blank" 
      rel="noopener noreferrer" 
      whileTap={{ scale: 0.98 }}
      className="group relative flex flex-col w-[260px] bg-zinc-900 rounded-[28px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.4)] border border-zinc-800 shrink-0 snap-start transition-all hover:border-[#c9a96e]/30"
    >
      <div className="relative aspect-[16/11] overflow-hidden bg-zinc-950">
        <img 
          src={car.imageUrl} 
          alt={car.model} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="bg-black/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-tight shadow-sm border border-white/10">
            {car.year}
          </div>
        </div>
      </div>
      
      <div className="p-6 flex flex-col gap-5">
        <div>
          <span className="text-[10px] text-[#c9a96e] font-heading font-bold uppercase tracking-[0.2em] block mb-1.5">{car.brand}</span>
          <h3 className="text-white font-semibold text-[16px] leading-tight font-heading line-clamp-1 group-hover:text-[#c9a96e] transition-colors">
            {car.model}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-zinc-800/50">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-tighter">Collectieprijs</span>
            <span className="font-heading text-[18px] font-bold text-[#c9a96e] tracking-tight">{car.price}</span>
          </div>
          
          <div className="w-10 h-10 flex items-center justify-center bg-zinc-800 text-white rounded-full group-hover:bg-[#c9a96e] group-hover:text-black transition-all duration-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </motion.a>
  );
};

export default CarCard;


import React from 'react';
import { SUGGESTIONS } from '../constants';

interface SuggestionsProps {
  onSelect: (text: string) => void;
  disabled: boolean;
}

const Suggestions: React.FC<SuggestionsProps> = ({ onSelect, disabled }) => {
  return (
    <div className="flex gap-3 overflow-x-auto px-6 pb-4 no-scrollbar">
      {SUGGESTIONS.map((text, i) => (
        <button
          key={i}
          onClick={() => onSelect(text)}
          disabled={disabled}
          className="whitespace-nowrap px-5 py-2.5 border border-zinc-800 bg-zinc-900 rounded-full text-zinc-400 text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-zinc-800 hover:border-[#c9a96e]/30 hover:text-[#c9a96e] transition-all disabled:opacity-20 active:scale-95"
        >
          {text}
        </button>
      ))}
    </div>
  );
};

export default Suggestions;

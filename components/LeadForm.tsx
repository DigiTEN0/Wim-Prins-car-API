
import React, { useState } from 'react';
import { UserData } from '../types';

interface LeadFormProps {
  onSubmit: (data: UserData) => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setIsSubmitting(true);
      setTimeout(() => onSubmit(formData), 300);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[28px] p-6 shadow-2xl max-w-[340px] mr-auto">
      <div className="mb-5 text-left">
        <h3 className="font-heading text-[17px] font-bold text-white tracking-tight">Klantprofiel</h3>
        <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">Om u exclusief advies te kunnen geven vragen wij om uw gegevens.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest ml-0.5">Uw volledige naam</label>
          <input 
            required
            type="text" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-[#c9a96e]/60 focus:bg-black transition-all placeholder:text-zinc-800"
            placeholder="Bijv. Jan de Vries"
          />
        </div>
        
        <div className="space-y-1">
          <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest ml-0.5">E-mailadres</label>
          <input 
            required
            type="email" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-[#c9a96e]/60 focus:bg-black transition-all placeholder:text-zinc-800"
            placeholder="naam@domein.nl"
          />
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-[#c9a96e] text-black font-bold text-[11px] uppercase tracking-[0.15em] rounded-xl hover:bg-[#d4b984] transition-all active:scale-[0.98] mt-2 shadow-lg shadow-[#c9a96e]/5 disabled:opacity-50"
        >
          Advies starten
        </button>
      </form>
    </div>
  );
};

export default LeadForm;

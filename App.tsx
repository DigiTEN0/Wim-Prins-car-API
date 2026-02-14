
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import InputArea from './components/InputArea';
import Suggestions from './components/Suggestions';
import { Message, UserData } from './types';
import { getChatResponse, laadVoorraad } from './services/geminiService';

const INITIAL_MESSAGE: Message = {
  id: '1',
  role: 'bot',
  text: "Welkom bij **Wim Prins**. Hoe kan ik u vandaag helpen bij uw zoektocht naar een bijzonder exemplaar uit onze collectie?",
  timestamp: new Date()
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [laden, setLaden] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const pendingQuery = useRef<string>("");

  useEffect(() => {
    laadVoorraad().then(() => setLaden(false));
  }, []);

  const addBotMessage = (text: string) => {
    setMessages(prev => [...prev, { 
      id: Date.now().toString(), 
      role: 'bot', 
      text, 
      timestamp: new Date() 
    }]);
  };

  const handleFormSubmit = async (data: UserData) => {
    setUserData(data);
    setShowForm(false);
    setIsTyping(true);
    try {
      const responseText = await getChatResponse(pendingQuery.current, messages, data);
      addBotMessage(responseText);
    } catch (err) {
      addBotMessage("Mijn excuses, er trad een fout op bij het raadplegen van de voorraad.");
    } finally {
      setIsTyping(false);
    }
  };

  const sendMessage = useCallback(async (text: string) => {
    if (laden || showForm || !text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    if (!userData.name) {
      pendingQuery.current = text;
      setShowForm(true);
      return;
    }
    setIsTyping(true);
    try {
      const responseText = await getChatResponse(text, messages, userData as UserData);
      addBotMessage(responseText);
    } catch (err) {
      addBotMessage("Verbinding onderbroken. Onze excuses.");
    } finally {
      setIsTyping(false);
    }
  }, [messages, laden, userData, showForm]);

  return (
    <div className="fixed inset-0 pointer-events-none flex items-end justify-end p-6 md:p-10 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto transition-all" 
            onClick={() => setIsOpen(false)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="relative pointer-events-auto w-full h-[88dvh] md:h-[760px] md:max-w-[440px] bg-[#0c0c0c] rounded-[44px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden border border-zinc-800"
          >
            <Header onClose={() => setIsOpen(false)} />
            
            <main className="flex-1 flex flex-col overflow-hidden relative">
              <ChatWindow 
                messages={messages} 
                isTyping={isTyping} 
                userName={userData.name} 
                showForm={showForm}
                onFormSubmit={handleFormSubmit}
              />
              
              <div className="mt-auto bg-[#0c0c0c] border-t border-zinc-800/50">
                {!showForm && (
                  <div className="pt-4">
                    <Suggestions onSelect={sendMessage} disabled={isTyping || laden} />
                  </div>
                )}
                <InputArea onSend={sendMessage} disabled={isTyping || laden || showForm} />
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto h-16 w-16 bg-[#0c0c0c] rounded-full flex items-center justify-center transition-all shadow-[0_15px_35px_rgba(0,0,0,0.4)] group border-[3px] border-white"
        >
          <img 
            src="https://wimprins.nl/assets/uploads/logos/logo-wim-prins.svg" 
            alt="Wim Prins" 
            className="w-7 h-7 object-contain brightness-0 invert opacity-90 transition-opacity"
          />
        </motion.button>
      )}
    </div>
  );
};

export default App;

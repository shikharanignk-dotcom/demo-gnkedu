import React, { useState } from 'react';
import { X, Send, Bot, User, Sparkles, MessageCircle, BookOpen } from 'lucide-react';

interface AiAssistantModalProps {
  onClose: () => void;
  onWhatsAppClick: (msg: string) => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ onClose, onWhatsAppClick }) => {
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am Guru Nanak IGNOU AI Helper. Ask me about any IGNOU Subject Code, assignment deadlines, project file formats, or pricing!',
      time: 'Just now',
    },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');

    // Generate smart response based on keywords
    setTimeout(() => {
      let reply = "All IGNOU assignments and projects are available at Guru Nanak Photostat! Handwritten files are ₹180 per subject, solved PDFs are ₹39, and project files start at ₹499. Would you like to order on WhatsApp?";

      const q = userText.toLowerCase();
      if (q.includes('price') || q.includes('cost') || q.includes('rate')) {
        reply = "Pricing at Guru Nanak Photostat:\n• Handwritten Assignment: ₹180 per subject (A4 foolscap, 25-30 pages)\n• Solved PDF Assignment: ₹39 per subject\n• Project File (Synopsis + Report): ₹499 - ₹1250\n• Notes & Guess Papers: ₹99 - ₹149";
      } else if (q.includes('deadline') || q.includes('last date') || q.includes('submission')) {
        reply = "For July 2025 session, the standard assignment submission deadline at IGNOU Study Centres is March 31st (extended to April 30th). For January 2026 session, deadline is September 30th (extended to October 31st).";
      } else if (q.includes('cod') || q.includes('cash on delivery') || q.includes('payment')) {
        reply = "Yes! Cash on Delivery (COD) is available for all physical handwritten assignment files and project reports across India via SpeedPost / DTDC!";
      } else if (q.includes('bevae') || q.includes('bsoc') || q.includes('bhdla') || q.includes('bag') || q.includes('dece') || q.includes('mba')) {
        reply = `Yes, complete 100% solved handwritten assignment and project files for ${userText.toUpperCase()} are ready for immediate dispatch!`;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full h-[80vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-[#0A66C2] text-white p-4 flex items-center justify-between border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">Guru Nanak IGNOU AI Assistant</h3>
              <p className="text-[11px] text-amber-300 font-semibold">24x7 Instant Course & Pricing Guidance</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  m.sender === 'user' ? 'bg-[#0A66C2] text-white' : 'bg-amber-100 text-amber-900'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-amber-600" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#0A66C2] text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-tl-none whitespace-pre-line'
                }`}
              >
                <p>{m.text}</p>
                <span
                  className={`text-[9px] mt-1 block text-right ${
                    m.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 space-y-2">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              placeholder="Ask about BEVAE-181, submission date, COD..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
            />
            <button
              type="submit"
              className="bg-[#0A66C2] hover:bg-blue-700 text-white p-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <button
            onClick={() => onWhatsAppClick('Hi, I was chatting with Guru Nanak IGNOU AI Assistant. I want to order on WhatsApp.')}
            className="w-full bg-[#FF7A00] text-white font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            Transfer Chat to WhatsApp (+91 95188 77939)
          </button>
        </div>

      </div>
    </div>
  );
};

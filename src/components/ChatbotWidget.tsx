'use client';

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: '¡Hola! Soy el asistente virtual de 3D Dental Studio. ¿En qué te puedo ayudar hoy?' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Agregar mensaje del usuario
    setMessages(prev => [...prev, { role: 'user', text: inputValue }]);
    setInputValue('');

    // Respuesta simulada del bot
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { role: 'bot', text: 'Gracias por tu consulta. En este momento estoy en versión de prueba, pero pronto podré resolver todas tus dudas sobre horarios, turnos y preparación para estudios.' }
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <Button 
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-[#3a2515] hover:bg-[#2a1708] shadow-lg flex items-center justify-center p-0 border border-[#d4af37]/30"
        >
          <MessageCircle className="w-7 h-7 text-[#d4af37]" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-80 shadow-2xl border-0 overflow-hidden flex flex-col h-[400px]">
          <CardHeader className="bg-[#3a2515] p-4 text-[#d4af37] flex flex-row items-center justify-between border-b border-[#d4af37]/20">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> Asistente 3D Dental
            </CardTitle>
            <button onClick={() => setIsOpen(false)} className="text-[#d4af37] hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#3a2515] text-[#d4af37] rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="p-3 bg-white border-t border-gray-100">
            <form onSubmit={handleSend} className="flex w-full gap-2">
              <Input 
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Escribe un mensaje..." 
                className="flex-1 text-sm rounded-full"
              />
              <Button type="submit" size="icon" className="rounded-full bg-[#3a2515] hover:bg-[#2a1708] text-[#d4af37] shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

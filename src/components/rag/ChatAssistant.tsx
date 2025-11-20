
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { ragApi } from '../../lib/vertex-ai/client';
import { ChatMessage } from '../../types';
import { Send, Bot, User, FileText, Sparkles, X } from 'lucide-react';

interface ChatAssistantProps {
  context?: string; // Contexto opcional (ex: "Analisando LDO")
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ context }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: 'Olá! Sou a IA do SGEM baseada no Vertex AI. Posso analisar a compatibilidade entre Projetos, PPA e LDO. Como posso ajudar?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await ragApi.sendMessage(messages, userMsg.content);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: 'error',
        role: 'model',
        content: 'Desculpe, tive um problema ao consultar a base de conhecimento.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col border-blue-200 shadow-lg bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-t-xl flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <Sparkles size={18} className="text-yellow-300" />
          </div>
          <div>
            <CardTitle className="text-base">Assistente IA (RAG)</CardTitle>
            <p className="text-xs text-blue-100 opacity-90">
              {context ? `Contexto: ${context}` : 'Base: PPA, LDO, LOA'}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" ref={scrollRef}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-2xl p-3 ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
              }`}>
                <div className="flex items-start gap-2">
                  {msg.role === 'model' && <Bot size={16} className="mt-1 text-blue-600 shrink-0" />}
                  <div className="text-sm leading-relaxed">
                    {msg.content.split('**').map((part, i) => 
                      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                    )}
                  </div>
                </div>

                {/* Citations / Grounding */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-100 space-y-2">
                    <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <FileText size={12} /> Fontes Verificadas:
                    </p>
                    {msg.citations.map(cit => (
                      <div key={cit.id} className="bg-slate-50 p-2 rounded border border-slate-200 text-xs">
                        <div className="font-medium text-blue-700 mb-1">{cit.title}</div>
                        <div className="text-slate-500 italic">"{cit.snippet}"</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl p-3 rounded-bl-none shadow-sm flex items-center gap-2">
                <Bot size={16} className="text-blue-600" />
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Pergunte sobre o alinhamento orçamentário..." 
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send size={18} />
            </Button>
          </form>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            A IA pode cometer erros. Verifique as informações nas leis originais.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

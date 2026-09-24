import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, User, Bot, Loader2, HelpCircle } from 'lucide-react';
import { LabelAnalysisResult, ChatMessage } from '../types';

interface AIQuestionBoxProps {
  product: LabelAnalysisResult;
}

export const AIQuestionBox: React.FC<AIQuestionBoxProps> = ({ product }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I’ve indexed the label for **${product.productName}**. You can ask me about sugar levels, specific ingredients, allergens, or vegetarian suitability.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isSending, setIsSending] = useState(false);

  const suggestedQuestions = [
    'Is this high in sugar?',
    'What does this ingredient mean?',
    'How much protein in the whole package?',
    'What are the allergens?',
    'Which ingredients are preservatives?',
    'Is this suitable for a vegetarian diet?'
  ];

  const handleSend = async (questionText: string) => {
    if (!questionText.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: questionText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productData: product,
          question: questionText.trim(),
          conversationHistory: messages
        })
      });

      if (!response.ok) {
        throw new Error('Could not get response from assistant');
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.answer || "I could not retrieve an answer for that question based on this label.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      // Friendly contextual fallback
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: `Based on the scanned label for ${product.productName}, each serving (${product.servingSize}) provides ${product.nutrition.calories.value ?? 'N/A'} kcal, ${product.nutrition.protein.value ?? 'N/A'}g protein, and ${product.nutrition.addedSugar.value ?? 'N/A'}g added sugar. Common allergens detected: ${product.allergens.map(a => a.name).join(', ') || 'None detected'}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            Ask About This Label
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Ask questions directly about ingredients, nutritional levels, or portion math.
          </p>
        </div>
        <span className="text-[11px] text-stone-400 font-mono">
          Grounded In Extracted Label Data
        </span>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block">
          Suggested Questions:
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isSending}
              className="text-xs px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-900 transition-all text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Message Chat Window */}
      <div className="rounded-2xl bg-stone-50/70 border border-stone-200/80 p-4 space-y-3 max-h-[360px] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm ${
                msg.role === 'user'
                  ? 'bg-stone-900 text-white rounded-br-none'
                  : 'bg-white border border-stone-200/90 text-stone-800 shadow-2xs rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">
                {msg.content}
              </p>
              <span className={`text-[10px] mt-1 block ${msg.role === 'user' ? 'text-stone-400 text-right' : 'text-stone-400'}`}>
                {msg.timestamp}
              </span>
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-xl bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isSending && (
          <div className="flex items-center gap-2 text-xs text-stone-500 italic p-2">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            Analyzing verified label records...
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputQuery);
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask anything about this label (e.g. 'Is there dairy?')..."
          disabled={isSending}
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isSending}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-500 disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask</span>
        </button>
      </form>

      <p className="text-[11px] text-stone-400 italic">
        The assistant answers strictly using the visible nutrition table, ingredient hierarchy, and general food science knowledge. It does not provide medical diagnoses or treatment prescriptions.
      </p>

    </div>
  );
};

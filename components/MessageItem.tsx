import React from 'react';
import { Message, Role } from '../types';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up mb-8`}>
      <div 
        className={`
          relative max-w-[85%] md:max-w-[70%] px-6 py-4 rounded-2xl
          ${isUser 
            ? 'bg-blue-600 text-white rounded-br-none' 
            : 'bg-slate-800/50 text-slate-100 rounded-bl-none border border-white/5'
          }
        `}
      >
        <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          {message.text}
        </div>
        
        {/* Optional: Timestamp or Status could go here */}
        <div className={`text-[10px] mt-2 opacity-50 ${isUser ? 'text-blue-100' : 'text-slate-400'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
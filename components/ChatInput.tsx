import React, { useState, useEffect, useRef } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    resetTranscript,
    isSupported 
  } = useSpeechRecognition();

  // Sync speech transcript to input
  useEffect(() => {
    if (transcript) {
      setInput(prev => {
        // Simple logic to avoid duplicating if the transcript is appending
        // Ideally, you'd manage cursor position, but for a simple chat, appending is okay.
        // We'll just replace for now or append if input was manually typed.
        if (prev.endsWith(transcript)) return prev;
        return prev + (prev && !prev.endsWith(' ') ? ' ' : '') + transcript;
      });
      resetTranscript(); // Clear buffer after consuming
    }
  }, [transcript, resetTranscript]);

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-grow
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  return (
    <div className="w-full px-4 pb-6 pt-2 bg-gradient-to-t from-aura-900 via-aura-900 to-transparent">
      <div className="max-w-3xl mx-auto relative">
        <div className={`
          relative flex items-end gap-2 p-2 rounded-3xl border transition-all duration-300
          ${isListening ? 'bg-blue-900/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/20 focus-within:border-white/30 focus-within:bg-white/10'}
        `}>
          
          {/* Microphone Button */}
          {isSupported && (
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isLoading}
              className={`
                p-3 rounded-full transition-all duration-200 flex-shrink-0
                ${isListening 
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 animate-pulse' 
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
                }
              `}
              title={isListening ? "Stop listening" : "Use voice input"}
            >
              {isListening ? (
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
          )}

          {/* Text Input */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening..." : "Ask whatever you want..."}
            className="w-full bg-transparent text-white placeholder-slate-400 text-base py-3 px-2 focus:outline-none resize-none max-h-[150px] custom-scrollbar"
            disabled={isLoading}
          />

          {/* Send Button */}
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className={`
              p-3 rounded-full transition-all duration-200 flex-shrink-0
              ${input.trim() && !isLoading
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 hover:scale-105' 
                : 'bg-white/5 text-slate-500 cursor-not-allowed'
              }
            `}
          >
            {isLoading ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 transform rotate-90?">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Helper Text */}
        <div className="text-center mt-3">
          <p className="text-[11px] text-slate-500">
            Aura can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Greeting } from './components/Greeting';
import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';
import { Message, Role } from './types';
import { sendMessageToGemini } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: uuidv4(),
      role: Role.USER,
      text: text,
      timestamp: Date.now(),
    };

    // Optimistically add user message
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      // Pass the current history + the new message to the service
      const responseText = await sendMessageToGemini(messages, text);

      const aiMsg: Message = {
        id: uuidv4(),
        role: Role.MODEL,
        text: responseText,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
      // system message to chat to inform user visually
      const errorMsg: Message = {
        id: uuidv4(),
        role: Role.MODEL,
        text: "I'm having trouble connecting right now. Please check your API key and connection.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-white overflow-hidden font-sans">
      
      
      <header className="absolute top-0 left-0 p-6 z-10 flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/50">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
              <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd" />
            </svg>
        </div>
        <span className="font-semibold tracking-wide text-sm text-slate-200">Aura</span>
      </header>

     
      <main className="flex-1 flex flex-col relative w-full h-full pt-16">
        {messages.length === 0 ? (
          <Greeting onSuggestionClick={handleSendMessage} />
        ) : (
          <MessageList messages={messages} isLoading={isLoading} />
        )}
      </main>

     
      <footer className="w-full">
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </footer>

      {/* Toast Notification for Errors */}
      {error && (
        <div className="absolute top-6 right-6 bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-lg text-sm backdrop-blur-md animate-fade-in-up">
          {error}
        </div>
      )}
    </div>
  );
};

export default App;
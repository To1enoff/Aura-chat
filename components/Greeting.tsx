import React from 'react';

interface GreetingProps {
  onSuggestionClick: (text: string) => void;
}

const SUGGESTIONS = [
  "Explain quantum computing simply",
  "Write a haiku about autumn",
  "Debug a Python script",
  "Plan a trip to Kyoto"
];

export const Greeting: React.FC<GreetingProps> = ({ onSuggestionClick }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-6 text-center animate-fade-in-up">
      <div className="mb-8 relative">
        <div className="w-16 h-16 bg-blue-500 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center mb-6 mx-auto transform rotate-3">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight">
          Hi there!
        </h1>
        <h2 className="text-2xl md:text-3xl font-medium text-slate-300 mb-6">
          What would you like to know?
        </h2>
        <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
          I can help you with analysis, creative writing, coding, and more. 
          Use one of the common prompts below or ask your own question.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-8">
        {SUGGESTIONS.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-left transition-colors duration-200 group"
          >
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
              {suggestion}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
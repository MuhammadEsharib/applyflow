import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, Lightbulb, TrendingUp, Target, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

interface AISuggestion {
  id: string;
  type: 'improvement' | 'insight' | 'automation' | 'recommendation';
  title: string;
  description: string;
  action?: () => void;
  icon: React.ComponentType<{ className?: string }>;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateSuggestions = useCallback(() => {
    const mockSuggestions: AISuggestion[] = [
      {
        id: '1',
        type: 'insight',
        title: 'Application Trend',
        description: 'Your application rate increased by 40% this week. Keep up the momentum!',
        icon: TrendingUp,
      },
      {
        id: '2',
        type: 'recommendation',
        title: 'Optimize Your Resume',
        description: 'Based on your applications, consider adding more keywords for tech roles.',
        icon: Lightbulb,
      },
      {
        id: '3',
        type: 'automation',
        title: 'Auto-Fill Ready',
        description: 'I can help you fill applications 3x faster. Want to try?',
        icon: Zap,
      },
      {
        id: '4',
        type: 'improvement',
        title: 'Follow-Up Reminder',
        description: '5 applications need follow-ups. Should I schedule reminders?',
        icon: Target,
      },
    ];

    setSuggestions(mockSuggestions);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsAnalyzing(true), 0);
      setTimeout(() => {
        generateSuggestions();
        setIsAnalyzing(false);
      }, 1500);
    }
  }, [isOpen, generateSuggestions]);

  const handleSendMessage = useCallback(() => {
    if (!message.trim()) return;

    // Simulate AI response
    setTimeout(() => {
      const newSuggestion: AISuggestion = {
        id: Date.now().toString(),
        type: 'insight',
        title: 'AI Response',
        description: `I understand you're asking about "${message}". Let me help you with that...`,
        icon: Bot,
      };
      setSuggestions(prev => [newSuggestion, ...prev]);
    }, 500);

    setMessage('');
  }, [message]);


  const getSuggestionColor = (type: AISuggestion['type']) => {
    switch (type) {
      case 'improvement': return 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-300';
      case 'insight': return 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300';
      case 'automation': return 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-300';
      case 'recommendation': return 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300';
      default: return 'bg-slate-50 dark:bg-slate-500/10 border-slate-200 dark:border-slate-500/20 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <>
      {/* AI Assistant Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white z-40"
      >
        <Bot className="w-6 h-6" />
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </motion.button>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 w-96 max-h-[600px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">AI Assistant</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Your intelligent job search companion</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
              >
                <span className="text-slate-400">×</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
                  />
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">Analyzing your data...</p>
                </div>
              ) : (
                <>
                  {suggestions.map((suggestion) => {
                    const Icon = suggestion.icon;
                    return (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          'p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md',
                          getSuggestionColor(suggestion.type)
                        )}
                        onClick={suggestion.action}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{suggestion.title}</h4>
                            <p className="text-xs opacity-80 mt-1">{suggestion.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {suggestions.length === 0 && (
                    <div className="text-center py-8">
                      <Sparkles className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">No suggestions yet. Start applying to jobs to get personalized insights!</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything about your job search..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  size="icon"
                  className="shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
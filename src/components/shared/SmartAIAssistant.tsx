import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Lightbulb, TrendingUp, Target, Zap, Briefcase, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

interface AISuggestion {
  id: string;
  type: 'insight' | 'automation' | 'recommendation' | 'action';
  title: string;
  description: string;
  action?: () => void;
  icon: React.ComponentType<{ className?: string }>;
  priority: 'low' | 'medium' | 'high';
}

interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: AISuggestion[];
}

export function SmartAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const addAIMessage = useCallback((content: string, suggestions?: AISuggestion[]) => {
    const newMessage: AIMessage = {
      id: `ai-${Date.now()}`,
      type: 'assistant',
      content,
      timestamp: new Date(),
      suggestions
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Generate contextual suggestions based on user activity
  const generateContextualSuggestions = useCallback(() => {
    const mockSuggestions: AISuggestion[] = [
      {
        id: '1',
        type: 'action',
        title: 'Create New Application',
        description: 'I can help you add a new job application with auto-fill from URL',
        action: () => {
          window.location.href = '/app/applications';
          setTimeout(() => {
            const event = new CustomEvent('openAddApplicationModal');
            window.dispatchEvent(event);
          }, 100);
        },
        icon: Briefcase,
        priority: 'high'
      },
      {
        id: '2',
        type: 'insight',
        title: 'Application Trend Analysis',
        description: 'Your application rate increased 40% this week. Consider maintaining this momentum.',
        icon: TrendingUp,
        priority: 'medium'
      },
      {
        id: '3',
        type: 'automation',
        title: 'Follow-up Automation',
        description: '5 applications need follow-ups. Should I schedule automatic reminders?',
        action: () => {
          addAIMessage('I\'ve scheduled follow-up reminders for your pending applications. You\'ll receive notifications at optimal times.');
        },
        icon: Zap,
        priority: 'high'
      },
      {
        id: '4',
        type: 'recommendation',
        title: 'Resume Optimization',
        description: 'Based on your recent applications, I recommend adding more technical keywords to your resume.',
        icon: Lightbulb,
        priority: 'medium'
      }
    ];

    setSuggestions(mockSuggestions);
  }, [addAIMessage]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsAnalyzing(true), 0);
      setTimeout(() => {
        generateContextualSuggestions();
        setTimeout(() => setIsAnalyzing(false), 0);

        // Welcome message
        addAIMessage('Hello! I\'m your AI career assistant. I can help you manage applications, optimize your resume, and provide insights. How can I assist you today?');
      }, 1500);
    }
  }, [isOpen, generateContextualSuggestions, addAIMessage]);

  const generateAIResponse = useCallback(async (userMessage: string) => {
    setIsTyping(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowerMessage = userMessage.toLowerCase();
    let response = 'I understand you\'re looking for assistance. As your AI career assistant, I can help with applications, resume optimization, interview prep, and job search strategy. Could you tell me more about what you\'d like to achieve?';
    let responseSuggestions: AISuggestion[] = [];

    if (lowerMessage.includes('application') || lowerMessage.includes('apply')) {
      response = 'I can help you with job applications! I can assist with creating new applications, tracking status, and optimizing your application strategy. Would you like me to help you create a new application or review your existing ones?';
      responseSuggestions = [
        {
          id: 'new-app',
          type: 'action',
          title: 'Create Application',
          description: 'Add a new job application with smart auto-fill',
          action: () => window.location.href = '/app/applications',
          icon: Briefcase,
          priority: 'high'
        }
      ];
    } else if (lowerMessage.includes('delete') || lowerMessage.includes('remove')) {
      response = 'I can help you manage your applications. Before deleting, let me show you which applications might need attention and help you make the best decision for your job search strategy.';
      responseSuggestions = [
        {
          id: 'manage-apps',
          type: 'action',
          title: 'Manage Applications',
          description: 'Review and organize your job applications',
          action: () => window.location.href = '/app/applications',
          icon: Settings,
          priority: 'medium'
        }
      ];
    } else if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
      response = 'I can analyze your resume and provide optimization suggestions! Based on current job market trends, I recommend focusing on technical skills and quantifiable achievements. Would you like me to review specific sections?';
      responseSuggestions = [
        {
          id: 'resume-opt',
          type: 'recommendation',
          title: 'Resume Optimization',
          description: 'Get personalized resume improvement suggestions',
          icon: Lightbulb,
          priority: 'high'
        }
      ];
    } else if (lowerMessage.includes('interview') || lowerMessage.includes('prepare')) {
      response = 'Interview preparation is crucial! I can help you with common questions, company research, and personalized tips based on the job description. What type of interview are you preparing for?';
    } else if (lowerMessage.includes('analytics') || lowerMessage.includes('stats') || lowerMessage.includes('progress')) {
      response = 'Your job search analytics show great progress! You\'ve increased your application rate by 40% this month and have a 25% response rate. I recommend focusing on companies with higher engagement rates. Would you like a detailed breakdown?';
      responseSuggestions = [
        {
          id: 'view-analytics',
          type: 'action',
          title: 'View Analytics',
          description: 'See detailed job search statistics',
          action: () => window.location.href = '/app/analytics',
          icon: TrendingUp,
          priority: 'medium'
        }
      ];
    } else if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
      response = 'I\'m here to help with your entire job search journey! I can:\n\n• Create and manage job applications\n• Optimize your resume and cover letter\n• Provide interview preparation\n• Analyze your job search progress\n• Suggest improvement strategies\n• Automate follow-up reminders\n\nWhat specific area would you like help with?';
    }

    addAIMessage(response, responseSuggestions);
    setIsTyping(false);
  }, [addAIMessage]);

  const handleSendMessage = useCallback(async () => {
    if (!message.trim()) return;

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    await generateAIResponse(message);
  }, [message, generateAIResponse]);

  const handleSuggestionClick = useCallback((suggestion: AISuggestion) => {
    if (suggestion.action) {
      suggestion.action();
    }

    // Add user message about the action
    const actionMessage: AIMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: `I'd like to ${suggestion.title.toLowerCase()}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, actionMessage]);

    // Generate AI response
    generateAIResponse(suggestion.title);
  }, [generateAIResponse]);

  const getSuggestionIcon = (type: AISuggestion['type']) => {
    switch (type) {
      case 'action': return Target;
      case 'insight': return TrendingUp;
      case 'automation': return Zap;
      case 'recommendation': return Lightbulb;
      default: return Bot;
    }
  };

  const getSuggestionColor = (type: AISuggestion['type']) => {
    switch (type) {
      case 'action': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'insight': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'automation': return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'recommendation': return 'bg-amber-50 border-amber-200 text-amber-700';
      default: return 'bg-slate-50 border-slate-200 text-slate-700';
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
            className="fixed bottom-24 right-6 w-96 max-h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">AI Assistant</h3>
                  <p className="text-xs text-slate-500">Your intelligent career manager</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <span className="text-slate-400">×</span>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
                  />
                  <p className="text-sm text-slate-500 mt-3">Analyzing your data...</p>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-3",
                        msg.type === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      {msg.type === 'assistant' && (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-2",
                        msg.type === 'user'
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-900"
                      )}>
                        <p className="text-sm whitespace-pre-line">{msg.content}</p>
                        {msg.suggestions && (
                          <div className="mt-3 space-y-2">
                            {msg.suggestions.map((suggestion) => {
                              const Icon = getSuggestionIcon(suggestion.type);
                              return (
                                <button
                                  key={suggestion.id}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className={cn(
                                    "w-full text-left p-2 rounded-lg border transition-all duration-200 text-xs",
                                    getSuggestionColor(suggestion.type)
                                  )}
                                >
                                  <div className="flex items-center gap-2">
                                    <Icon className="w-4 h-4" />
                                    <div>
                                      <div className="font-medium">{suggestion.title}</div>
                                      <div className="opacity-80">{suggestion.description}</div>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-slate-100 rounded-2xl px-4 py-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Quick Actions */}
            {suggestions.length > 0 && messages.length === 0 && (
              <div className="p-4 border-t border-slate-200">
                <div className="text-xs font-semibold text-slate-500 mb-2">Quick Actions</div>
                <div className="grid grid-cols-2 gap-2">
                  {suggestions.slice(0, 4).map((suggestion) => {
                    const Icon = getSuggestionIcon(suggestion.type);
                    return (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={cn(
                          "p-2 rounded-lg border text-xs transition-all duration-200",
                          getSuggestionColor(suggestion.type)
                        )}
                      >
                        <Icon className="w-4 h-4 mb-1" />
                        <div className="font-medium">{suggestion.title}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

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
                  disabled={!message.trim() || isTyping}
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
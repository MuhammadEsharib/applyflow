import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  Bot,
  Send,
  MessageCircle,
  Phone,
  Video,
  Minimize2,
  Maximize2,
  Clock,
  Star,
  Circle,
  Check,
  Users,
  Paperclip,
  CheckCheck,
  Smile,
  Search,
  Headphones
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: {
    name: string;
    avatar: string;
    type: 'user' | 'agent' | 'bot';
    isOnline?: boolean;
  };
  content: {
    text: string;
    timestamp: string;
    status?: 'sending' | 'sent' | 'delivered' | 'read';
  };
  reactions?: {
    heart: number;
    thumbsUp: number;
  };
}

interface ChatAgent {
  id: string;
  name: string;
  avatar: string;
  role: string;
  status: 'online' | 'busy' | 'offline';
  expertise: string[];
  rating: number;
  responseTime: string;
  languages: string[];
  isAvailable: boolean;
}

const mockAgents: ChatAgent[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'SJ',
    role: 'Career Coach',
    status: 'online',
    expertise: ['Resume Review', 'Interview Prep', 'Career Strategy'],
    rating: 4.9,
    responseTime: '< 2 min',
    languages: ['English', 'Spanish'],
    isAvailable: true
  },
  {
    id: '2',
    name: 'Michael Chen',
    avatar: 'MC',
    role: 'Tech Recruiter',
    status: 'online',
    expertise: ['Tech Jobs', 'Salary Negotiation', 'Technical Interviews'],
    rating: 4.8,
    responseTime: '< 3 min',
    languages: ['English', 'Mandarin'],
    isAvailable: true
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    avatar: 'ER',
    role: 'HR Specialist',
    status: 'busy',
    expertise: ['Company Culture', 'Benefits', 'Onboarding'],
    rating: 4.7,
    responseTime: '< 5 min',
    languages: ['English', 'Portuguese'],
    isAvailable: false
  }
];

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    sender: {
      name: 'ApplyFlow Bot',
      avatar: 'AI',
      type: 'bot'
    },
    content: {
      text: 'Hello! Welcome to ApplyFlow Live Chat. How can I help you today? I can assist with job applications, resume tips, interview preparation, and more.',
      timestamp: '10:00 AM'
    }
  }
];

const typingMessages = [
  'Analyzing your question...',
  'Finding the best answer...',
  'Preparing a response...',
  'Almost there...'
];

export default function LiveChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<ChatAgent | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAgents, setShowAgents] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const [chatStats, setChatStats] = useState({
    avgResponseTime: 2.3,
    satisfactionRate: 96,
    activeChats: 23,
    resolvedToday: 147
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Dynamic stats animation
  useEffect(() => {
    const interval = setInterval(() => {
      setChatStats(prev => ({
        avgResponseTime: Math.max(1.5, Math.min(5, prev.avgResponseTime + (Math.random() - 0.5) * 0.3)),
        satisfactionRate: Math.max(90, Math.min(99, prev.satisfactionRate + (Math.random() - 0.5) * 2)),
        activeChats: Math.max(15, prev.activeChats + Math.floor((Math.random() - 0.5) * 5)),
        resolvedToday: Math.max(100, prev.resolvedToday + Math.floor((Math.random() - 0.5) * 3))
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Typing indicator animation
  useEffect(() => {
    if (isTyping) {
      const interval = setInterval(() => {
        setTypingMessage(prev => {
          const currentIndex = typingMessages.indexOf(prev);
          return typingMessages[(currentIndex + 1) % typingMessages.length];
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isTyping]);

  const filteredAgents = mockAgents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: {
          name: 'You',
          avatar: 'YU',
          type: 'user'
        },
        content: {
          text: newMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sending'
        }
      };

      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      setIsTyping(true);

      // Simulate agent response
      setTimeout(() => {
        const responses = [
          'I understand your concern. Let me help you with that.',
          'That\'s a great question! Here\'s what I recommend...',
          'Based on your situation, I suggest the following approach...',
          'I\'ve helped many people with similar challenges. Here\'s what worked for them...',
          'Let me break this down for you step by step...'
        ];

        const agentMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: {
            name: selectedAgent?.name || 'ApplyFlow Bot',
            avatar: selectedAgent?.avatar || 'AI',
            type: selectedAgent ? 'agent' : 'bot',
            isOnline: true
          },
          content: {
            text: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        };

        setMessages(prev => [...prev, agentMessage]);
        setIsTyping(false);
      }, 2000 + Math.random() * 2000);
    }
  };

  const handleAgentSelect = (agent: ChatAgent) => {
    setSelectedAgent(agent);
    setShowAgents(false);

    const welcomeMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: {
        name: agent.name,
        avatar: agent.avatar,
        type: 'agent',
        isOnline: true
      },
      content: {
        text: `Hi! I'm ${agent.name}, your ${agent.role}. I specialize in ${agent.expertise.join(', ')}. How can I assist you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    };

    setMessages(prev => [...prev, welcomeMessage]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-slate-300';
      default: return 'bg-slate-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Available';
      case 'busy': return 'Busy';
      case 'offline': return 'Offline';
      default: return 'Offline';
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${isExpanded ? 'w-full h-full max-w-6xl max-h-[90vh]' : 'w-96 h-[600px]'}`}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="h-full flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <MessageCircle className="w-6 h-6" />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>
              <div>
                <h3 className="font-semibold">Live Chat Support</h3>
                <p className="text-sm opacity-90">
                  {selectedAgent ? `Chatting with ${selectedAgent.name}` : 'Choose an agent to start'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Video className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Avg: {chatStats.avgResponseTime.toFixed(1)}min
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                {chatStats.satisfactionRate}% satisfied
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span>{chatStats.activeChats} active chats</span>
              <span>{chatStats.resolvedToday} resolved today</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${message.sender.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.sender.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className="flex items-end gap-2 mb-1">
                        {message.sender.type !== 'user' && (
                          <div className="flex items-center gap-2 order-1">
                            <div className="w-6 h-6 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {message.sender.avatar}
                            </div>
                            <span className="text-xs text-slate-500">{message.sender.name}</span>
                          </div>
                        )}
                        <span className="text-xs text-slate-400 order-2">
                          {message.content.timestamp}
                        </span>
                      </div>
                      <div
                        className={`p-3 rounded-2xl ${message.sender.type === 'user'
                          ? 'bg-blue-600 text-white order-2'
                          : 'bg-slate-100 text-slate-900 order-1'
                          }`}
                      >
                        <p className="text-sm">{message.content.text}</p>
                      </div>
                      {message.content.status && (
                        <div className="flex items-center gap-1 mt-1 order-2">
                          {message.content.status === 'sending' && <Circle className="w-3 h-3 text-slate-400" />}
                          {message.content.status === 'sent' && <Check className="w-3 h-3 text-slate-400" />}
                          {message.content.status === 'delivered' && <CheckCheck className="w-3 h-3 text-slate-400" />}
                          {message.content.status === 'read' && <CheckCheck className="w-3 h-3 text-blue-600" />}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex justify-start"
                  >
                    <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <motion.div
                            className="w-2 h-2 bg-slate-400 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-slate-400 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-slate-400 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                          />
                        </div>
                        <span className="text-sm text-slate-500">{typingMessage}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-200 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAgents(!showAgents)}
                  className="text-slate-500 hover:text-blue-600"
                >
                  <Users className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-blue-600">
                  <Smile className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-blue-600">
                  <Paperclip className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Agents Sidebar */}
          <AnimatePresence>
            {showAgents && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="bg-slate-50 border-l border-slate-200 overflow-hidden"
              >
                <div className="p-4 h-full flex flex-col">
                  <h4 className="font-semibold text-slate-900 mb-4">Available Agents</h4>

                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search agents..."
                      className="pl-10 text-sm"
                    />
                  </div>

                  {/* Agent List */}
                  <div className="flex-1 overflow-y-auto space-y-3">
                    {filteredAgents.map(agent => (
                      <motion.div
                        key={agent.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAgentSelect(agent)}
                        className={`bg-white p-3 rounded-lg cursor-pointer transition-all ${selectedAgent?.id === agent.id ? 'ring-2 ring-blue-500' : ''
                          } ${!agent.isAvailable ? 'opacity-60' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {agent.avatar}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(agent.status)} rounded-full border-2 border-white`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-semibold text-slate-900 text-sm">{agent.name}</h5>
                              <span className="text-xs text-slate-500">{getStatusText(agent.status)}</span>
                            </div>
                            <p className="text-xs text-slate-600 mb-2">{agent.role}</p>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="text-xs text-slate-600">{agent.rating}</span>
                              </div>
                              <span className="text-xs text-slate-500">{agent.responseTime}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {agent.expertise.slice(0, 2).map((exp, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                                >
                                  {exp}
                                </span>
                              ))}
                              {agent.expertise.length > 2 && (
                                <span className="text-xs text-slate-500">+{agent.expertise.length - 2}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                      <Headphones className="w-4 h-4 mr-2" />
                      Request Callback
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                      <Bot className="w-4 h-4 mr-2" />
                      Chat with AI Assistant
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

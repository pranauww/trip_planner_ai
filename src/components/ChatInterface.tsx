import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, MapPin, Calendar, DollarSign } from 'lucide-react';
import { TripData, ChatMessage } from '../App';

interface ChatInterfaceProps {
  tripData: TripData;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onComplete: () => void;
  isPlanning: boolean;
  setIsPlanning: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  tripData,
  messages,
  setMessages,
  onComplete,
  isPlanning,
  setIsPlanning
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage, tripData);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string, trip: TripData): string => {
    const responses = [
      `Based on your ${trip.tripType} from ${trip.fromLocation} to ${trip.toLocation}, I'd recommend starting with some amazing local experiences. What specific activities interest you most?`,
      `Great question! For your ${trip.people}-person trip with a $${trip.budget} budget, I can suggest some fantastic options. Would you prefer luxury accommodations or more budget-friendly options?`,
      `I love that you're interested in ${userInput.toLowerCase()}! Given your preferences for ${trip.preferences.join(', ')}, I think you'll enjoy some hidden gems I know about. Should we focus on the cultural aspects or outdoor adventures?`,
      `Perfect! I'm crafting a personalized itinerary that balances your interests with the best of ${trip.toLocation}. Are you looking for a packed schedule or a more relaxed pace?`,
      `Excellent choice! I'm finding the perfect blend of popular attractions and local secrets for your trip. Do you have any dietary restrictions or accessibility needs I should consider?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickSuggestions = [
    "Show me the best restaurants",
    "What are the must-see attractions?",
    "Find me budget-friendly hotels",
    "Plan a day-by-day itinerary",
    "Show me scenic routes",
    "What's the local culture like?"
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">AI Travel Assistant</h2>
            <p className="text-blue-100 text-sm">
              Planning your {tripData.tripType} to {tripData.toLocation}
            </p>
          </div>
        </div>
        
        {/* Trip Summary */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{tripData.fromLocation} → {tripData.toLocation}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{tripData.startDate} - {tripData.endDate}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <DollarSign className="w-4 h-4" />
            <span>Budget: ${tripData.budget}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span>👥 {tripData.people} people</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.type === 'ai' && (
                    <Bot className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  {message.type === 'user' && (
                    <User className="w-5 h-5 text-blue-100 mt-0.5 flex-shrink-0" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-blue-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length > 1 && (
        <div className="px-6 pb-4">
          <p className="text-sm text-gray-600 mb-3">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(suggestion)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 p-6">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your trip..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              disabled={isTyping}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Complete Button */}
      {messages.length > 3 && (
        <div className="px-6 pb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate Visual Itinerary</span>
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default ChatInterface; 
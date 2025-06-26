import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { TripData, ChatMessage } from './types';
import Header from './components/Header';
import TripForm from './components/TripForm';
import ChatInterface from './components/ChatInterface';
import VisualOutput from './components/VisualOutput';

function App() {
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [currentStep, setCurrentStep] = useState<'form' | 'chat' | 'visual'>('form');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isPlanning, setIsPlanning] = useState(false);

  const handleFormComplete = (data: TripData) => {
    setTripData(data);
    setCurrentStep('chat');
    
    // Add initial AI message
    const initialMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: `Hello! I'm excited to help you plan your ${data.tripType} from ${data.fromLocation} to ${data.toLocation}. I can see you're traveling with ${data.people} people and have a budget of $${data.budget}. Your interests include ${data.preferences.join(', ')}. What would you like to know about your trip?`,
      timestamp: new Date()
    };
    setChatMessages([initialMessage]);
  };

  const handleChatComplete = () => {
    setCurrentStep('visual');
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
    setTripData(null);
    setChatMessages([]);
  };

  const handleBackToChat = () => {
    setCurrentStep('chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster position="top-right" />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {currentStep === 'form' && (
          <TripForm onSubmit={handleFormComplete} />
        )}
        
        {currentStep === 'chat' && tripData && (
          <div className="max-w-4xl mx-auto">
            <ChatInterface
              tripData={tripData}
              messages={chatMessages}
              setMessages={setChatMessages}
              onComplete={handleChatComplete}
              isPlanning={isPlanning}
              setIsPlanning={setIsPlanning}
            />
          </div>
        )}
        
        {currentStep === 'visual' && tripData && (
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Your Travel Itinerary
              </h1>
              <div className="flex space-x-4">
                <button
                  onClick={handleBackToChat}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Back to Chat
                </button>
                <button
                  onClick={handleBackToForm}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Plan New Trip
                </button>
              </div>
            </div>
            <VisualOutput 
              tripData={tripData} 
              chatMessages={chatMessages} 
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App; 
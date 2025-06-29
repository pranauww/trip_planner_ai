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
      content: `Hello! I'm excited to help you plan your trip! ${data.tripType ? `I can see you're planning a ${data.tripType}.` : ''} ${data.fromLocation && data.toLocation ? `You're traveling from ${data.fromLocation} to ${data.toLocation}.` : ''} ${data.people ? `You're traveling with ${data.people} people.` : ''} ${data.budget ? `Your budget is $${data.budget}.` : ''} ${data.preferences.length > 0 ? `Your interests include ${data.preferences.join(', ')}.` : ''} What would you like to know about your trip?`,
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
    <div className="min-h-screen bg-gray-900 text-white">
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#374151',
            color: '#fff',
            border: '1px solid #4B5563'
          }
        }}
      />
      
      {currentStep === 'form' && (
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-80 bg-gray-800 border-r border-gray-700 p-6 overflow-y-auto">
            <TripForm onComplete={handleFormComplete} />
          </div>
          
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-2xl">
                <h1 className="text-4xl font-bold text-white mb-4">
                  AI Travel Assistant
                </h1>
                <p className="text-gray-300 text-lg mb-8">
                  Fill in the trip details on the left to get started, or ask me anything about travel planning!
                </p>
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <p className="text-gray-400 text-sm">
                    💡 <strong>Tip:</strong> The more details you provide, the more personalized your recommendations will be. But don't worry - you can always add more information later!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {currentStep === 'chat' && tripData && (
        <div className="h-screen flex flex-col">
          <Header />
          <div className="flex-1 overflow-hidden">
            <ChatInterface
              tripData={tripData}
              messages={chatMessages}
              setMessages={setChatMessages}
              onComplete={handleChatComplete}
              isPlanning={isPlanning}
              setIsPlanning={setIsPlanning}
            />
          </div>
        </div>
      )}
      
      {currentStep === 'visual' && tripData && (
        <div className="h-screen flex flex-col">
          <Header />
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">
                  Your Travel Itinerary
                </h1>
                <div className="flex space-x-4">
                  <button
                    onClick={handleBackToChat}
                    className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
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
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 
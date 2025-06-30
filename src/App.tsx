import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { TripData, ChatMessage } from './types';
import Header from './components/Header';
import TripForm from './components/TripForm';
import ChatInterface from './components/ChatInterface';
import VisualOutput from './components/VisualOutput';

function App() {
  const [tripData, setTripData] = useState<TripData>({
    tripType: '',
    fromLocation: '',
    toLocation: '',
    startDate: '',
    endDate: '',
    budget: 1000,
    people: 2,
    preferences: [],
    notes: ''
  });
  const [currentStep, setCurrentStep] = useState<'chat' | 'visual'>('chat');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isPlanning, setIsPlanning] = useState(false);

  const handleTripDataChange = (newTripData: TripData) => {
    setTripData(newTripData);
    
    // If this is the first time setting trip data and we have some meaningful information, add an initial AI message
    if (chatMessages.length === 0 && (newTripData.tripType || newTripData.toLocation || newTripData.fromLocation)) {
      const initialMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: `Hello! I'm excited to help you plan your trip! ${newTripData.tripType ? `I can see you're planning a ${newTripData.tripType}.` : ''} ${newTripData.fromLocation && newTripData.toLocation ? `You're traveling from ${newTripData.fromLocation} to ${newTripData.toLocation}.` : ''} ${newTripData.people ? `You're traveling with ${newTripData.people} people.` : ''} ${newTripData.budget ? `Your budget is $${newTripData.budget}.` : ''} ${newTripData.preferences.length > 0 ? `Your interests include ${newTripData.preferences.join(', ')}.` : ''} What would you like to know about your trip?`,
        timestamp: new Date()
      };
      setChatMessages([initialMessage]);
    }
  };

  const handleChatComplete = () => {
    setCurrentStep('visual');
  };

  const handleBackToChat = () => {
    setCurrentStep('chat');
  };

  const handleBackToForm = () => {
    setCurrentStep('chat');
    setTripData({
      tripType: '',
      fromLocation: '',
      toLocation: '',
      startDate: '',
      endDate: '',
      budget: 1000,
      people: 2,
      preferences: [],
      notes: ''
    });
    setChatMessages([]);
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
      
      {currentStep === 'chat' && (
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-80 bg-gray-800 border-r border-gray-700 p-6 overflow-y-auto">
            <TripForm 
              tripData={tripData} 
              onTripDataChange={handleTripDataChange} 
            />
          </div>
          
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
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
        </div>
      )}
      
      {currentStep === 'visual' && (
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-80 bg-gray-800 border-r border-gray-700 p-6 overflow-y-auto">
            <TripForm 
              tripData={tripData} 
              onTripDataChange={handleTripDataChange} 
            />
          </div>
          
          {/* Main Visual Area */}
          <div className="flex-1 flex flex-col">
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
        </div>
      )}
    </div>
  );
}

export default App; 
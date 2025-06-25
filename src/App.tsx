import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import TripForm from './components/TripForm';
import ChatInterface from './components/ChatInterface';
import VisualOutput from './components/VisualOutput';
import Header from './components/Header';

export interface TripData {
  tripType: 'vacation' | 'business' | 'roadtrip' | 'weekend' | 'daytrip';
  fromLocation: string;
  toLocation: string;
  startDate: string;
  endDate: string;
  budget: number;
  people: number;
  preferences: string[];
  additionalNotes: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

function App() {
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isPlanning, setIsPlanning] = useState(false);
  const [currentStep, setCurrentStep] = useState<'form' | 'chat' | 'visual'>('form');

  const handleFormSubmit = (data: TripData) => {
    setTripData(data);
    setCurrentStep('chat');
    // Add initial AI message
    const initialMessage: ChatMessage = {
      id: '1',
      type: 'ai',
      content: `Great! I see you're planning a ${data.tripType} from ${data.fromLocation} to ${data.toLocation} for ${data.people} people with a budget of $${data.budget}. Let me help you create the perfect itinerary! What kind of experience are you looking for?`,
      timestamp: new Date()
    };
    setChatMessages([initialMessage]);
  };

  const handleChatComplete = () => {
    setCurrentStep('visual');
    setIsPlanning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster position="top-right" />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {currentStep === 'form' && (
          <div className="max-w-4xl mx-auto">
            <TripForm onSubmit={handleFormSubmit} />
          </div>
        )}

        {currentStep === 'chat' && tripData && (
          <div className="max-w-6xl mx-auto">
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
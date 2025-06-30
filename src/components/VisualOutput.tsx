import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Download,
  Share2,
  Heart,
  Navigation
} from 'lucide-react';
import { TripData, ChatMessage, ItineraryItem } from '../types';
import { AIService } from '../services/aiService';
import { formatTextWithLineBreaks } from '../utils/textFormatting';
import InteractiveMap from './InteractiveMap';
import GlobeView from './GlobeView';
import ItineraryCard from './ItineraryCard';
import toast from 'react-hot-toast';

interface VisualOutputProps {
  tripData: TripData;
  chatMessages: ChatMessage[];
}

const VisualOutput: React.FC<VisualOutputProps> = ({ tripData, chatMessages }) => {
  const [activeTab, setActiveTab] = useState<'map' | 'globe' | 'itinerary'>('map');
  const [selectedDay, setSelectedDay] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState<string>('');

  useEffect(() => {
    generateAIItinerary();
  }, []);

  const generateAIItinerary = async () => {
    setIsLoading(true);
    try {
      const aiResponse = await AIService.generateItinerary(tripData, chatMessages);
      
      if (aiResponse.recommendations && aiResponse.recommendations.length > 0) {
        // Convert AI recommendations to itinerary items
        const itineraryItems: ItineraryItem[] = aiResponse.recommendations.map((rec, index) => ({
          id: (index + 1).toString(),
          day: Math.floor(index / 4) + 1, // Distribute across days
          time: getTimeForIndex(index),
          activity: rec.name,
          location: rec.location,
          description: rec.description,
          type: rec.type,
          cost: rec.cost || Math.floor(Math.random() * 200) + 50,
          rating: typeof rec.rating === 'string' ? parseFloat(rec.rating) : (rec.rating || 4.0),
          image: rec.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'
        }));
        
        setItinerary(itineraryItems);
      } else {
        // Fallback to mock data if no AI recommendations
        setItinerary(getMockItinerary());
      }
      
      // Clean the AI insights text before setting it
      const cleanedInsights = cleanInsightsText(aiResponse.message);
      setAiInsights(cleanedInsights);
      
    } catch (error) {
      console.error('Error generating AI itinerary:', error);
      toast.error('Failed to generate AI itinerary. Using default recommendations.');
      setItinerary(getMockItinerary());
      setAiInsights('I\'ve prepared a great itinerary for your trip! Here are some highlights and recommendations based on your preferences.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeForIndex = (index: number): string => {
    const times = ['09:00', '12:00', '14:00', '19:00'];
    return times[index % times.length];
  };

  const getMockItinerary = (): ItineraryItem[] => [
    {
      id: '1',
      day: 1,
      time: '09:00',
      activity: 'Departure Flight',
      location: `${tripData.fromLocation} Airport`,
      description: 'Direct flight to your destination',
      type: 'flight',
      cost: 250,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400'
    },
    {
      id: '2',
      day: 1,
      time: '12:00',
      activity: 'Hotel Check-in',
      location: 'Downtown Hotel',
      description: 'Luxury accommodation in the heart of the city',
      type: 'hotel',
      cost: 150,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'
    },
    {
      id: '3',
      day: 1,
      time: '14:00',
      activity: 'City Tour',
      location: 'Historic District',
      description: 'Guided walking tour of the main attractions',
      type: 'activity',
      cost: 45,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400'
    },
    {
      id: '4',
      day: 1,
      time: '19:00',
      activity: 'Local Restaurant',
      location: 'Seaside Bistro',
      description: 'Authentic local cuisine with ocean views',
      type: 'restaurant',
      cost: 35,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400'
    }
  ];

  const cleanInsightsText = (text: string): string => {
    // Remove JSON objects from the insights text to make it readable
    const cleanedText = text.replace(/\{\s*"type"\s*:\s*"[^"]+"[^}]*\}/g, '');
    
    // Clean up any extra whitespace and punctuation that might be left
    const finalText = cleanedText
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\s*,\s*/g, ', ') // Clean up commas
      .replace(/\s*\.\s*/g, '. ') // Clean up periods
      .replace(/\s*!\s*/g, '! ') // Clean up exclamation marks
      .replace(/\s*\?\s*/g, '? ') // Clean up question marks
      .trim();
    
    return finalText;
  };

  const totalCost = itinerary.reduce((sum, item) => sum + item.cost, 0);
  const days = Math.max(...itinerary.map(item => item.day), 1);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400 text-base">Generating your AI-powered itinerary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {tripData.tripType && `Your ${tripData.tripType}`}
              {tripData.toLocation && ` to ${tripData.toLocation}`}
            </h1>
            <p className="text-gray-400 mt-1 text-base">
              {tripData.startDate && tripData.endDate && `${tripData.startDate} - ${tripData.endDate}`}
              {tripData.people && ` • ${tripData.people} people`}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-3 rounded-lg transition-colors ${
                isFavorite 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-700 text-gray-400 hover:bg-red-600 hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-gray-700 text-gray-400 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-gray-700 text-gray-400 rounded-lg hover:bg-green-600 hover:text-white transition-colors"
            >
              <Download className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Trip Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              <span className="text-base font-medium text-gray-300">Route</span>
            </div>
            <p className="text-lg font-semibold text-white mt-1">
              {tripData.fromLocation && tripData.toLocation ? `${tripData.fromLocation} → ${tripData.toLocation}` : 'TBD'}
            </p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-400" />
              <span className="text-base font-medium text-gray-300">Duration</span>
            </div>
            <p className="text-lg font-semibold text-white mt-1">
              {days} days
            </p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-purple-400" />
              <span className="text-base font-medium text-gray-300">Total Cost</span>
            </div>
            <p className="text-lg font-semibold text-white mt-1">
              ${totalCost}
            </p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-orange-400" />
              <span className="text-base font-medium text-gray-300">Travelers</span>
            </div>
            <p className="text-lg font-semibold text-white mt-1">
              {tripData.people || 'TBD'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 rounded-lg shadow-xl p-2 border border-gray-700">
        <div className="flex space-x-2">
          {[
            { id: 'map', label: 'Interactive Map', icon: MapPin },
            { id: 'globe', label: '3D Globe', icon: Navigation },
            { id: 'itinerary', label: 'Day-by-Day', icon: Calendar }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all text-base ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700"
      >
        {activeTab === 'map' && (
          <div className="h-96">
            <InteractiveMap 
              fromLocation={tripData.fromLocation}
              toLocation={tripData.toLocation}
              itinerary={itinerary}
            />
          </div>
        )}

        {activeTab === 'globe' && (
          <div className="h-96">
            <GlobeView 
              fromLocation={tripData.fromLocation}
              toLocation={tripData.toLocation}
            />
          </div>
        )}

        {activeTab === 'itinerary' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Your AI-Generated Itinerary</h3>
              <div className="flex space-x-2">
                {Array.from({ length: days }, (_, i) => i + 1).map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors text-base ${
                      selectedDay === day
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    Day {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {itinerary
                .filter(item => item.day === selectedDay)
                .map((item) => (
                  <ItineraryCard key={item.id} item={item} />
                ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700"
      >
        <h3 className="text-2xl font-semibold text-white mb-4">AI Travel Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-white mb-2 text-lg">AI Recommendations</h4>
            <p className="text-gray-300 text-lg">
              {aiInsights ? formatTextWithLineBreaks(aiInsights) : 'Based on your preferences and trip details, I\'ve curated a personalized itinerary that balances your interests with the best experiences available.'}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2 text-lg">Local Tips</h4>
            <p className="text-gray-300 text-lg">
              Best time to visit attractions is early morning. Local currency is accepted 
              everywhere, but credit cards are preferred for larger purchases.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VisualOutput; 
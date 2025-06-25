import React, { useState } from 'react';
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
import { TripData, ChatMessage } from '../App';
import InteractiveMap from './InteractiveMap';
import GlobeView from './GlobeView';
import ItineraryCard from './ItineraryCard';

interface VisualOutputProps {
  tripData: TripData;
  chatMessages: ChatMessage[];
}

interface ItineraryItem {
  id: string;
  day: number;
  time: string;
  activity: string;
  location: string;
  description: string;
  type: 'flight' | 'hotel' | 'activity' | 'food' | 'transport';
  cost: number;
  rating: number;
  image: string;
}

const VisualOutput: React.FC<VisualOutputProps> = ({ tripData, chatMessages }) => {
  const [activeTab, setActiveTab] = useState<'map' | 'globe' | 'itinerary'>('map');
  const [selectedDay, setSelectedDay] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock itinerary data
  const itinerary: ItineraryItem[] = [
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
      type: 'food',
      cost: 35,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400'
    }
  ];

  const totalCost = itinerary.reduce((sum, item) => sum + item.cost, 0);
  const days = Math.max(...itinerary.map(item => item.day));

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Your {tripData.tripType} to {tripData.toLocation}
            </h1>
            <p className="text-gray-600 mt-1">
              {tripData.startDate} - {tripData.endDate} • {tripData.people} people
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-3 rounded-xl transition-colors ${
                isFavorite 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-blue-100 hover:text-blue-600 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-green-100 hover:text-green-600 transition-colors"
            >
              <Download className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Trip Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Route</span>
            </div>
            <p className="text-lg font-semibold text-blue-900 mt-1">
              {tripData.fromLocation} → {tripData.toLocation}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-900">Duration</span>
            </div>
            <p className="text-lg font-semibold text-green-900 mt-1">
              {days} days
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Total Cost</span>
            </div>
            <p className="text-lg font-semibold text-purple-900 mt-1">
              ${totalCost}
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Travelers</span>
            </div>
            <p className="text-lg font-semibold text-orange-900 mt-1">
              {tripData.people}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-xl p-2">
        <div className="flex space-x-2">
          {[
            { id: 'map', label: 'Interactive Map', icon: MapPin },
            { id: 'globe', label: '3D Globe', icon: Navigation },
            { id: 'itinerary', label: 'Day-by-Day', icon: Calendar }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
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
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
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
              <h3 className="text-xl font-semibold text-gray-900">Your Itinerary</h3>
              <div className="flex space-x-2">
                {Array.from({ length: days }, (_, i) => i + 1).map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedDay === day
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-xl p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Travel Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Weather Forecast</h4>
            <p className="text-gray-600 text-sm">
              Expect sunny weather with temperatures between 22-28°C during your stay. 
              Perfect conditions for outdoor activities and sightseeing.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Local Tips</h4>
            <p className="text-gray-600 text-sm">
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
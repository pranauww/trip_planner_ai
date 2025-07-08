import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  MapPin, 
  DollarSign, 
  Star, 
  Plane, 
  Hotel, 
  Utensils, 
  Camera,
  Car
} from 'lucide-react';
import { ItineraryItem } from '../types';
import { formatTextWithLineBreaks } from '../utils/textFormatting';

interface ItineraryCardProps {
  item: ItineraryItem;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({ item }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return Plane;
      case 'hotel':
        return Hotel;
      case 'food':
      case 'restaurant':
        return Utensils;
      case 'activity':
        return Camera;
      case 'transport':
        return Car;
      default:
        return MapPin;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'flight':
        return 'bg-blue-600 text-white';
      case 'hotel':
        return 'bg-green-600 text-white';
      case 'food':
      case 'restaurant':
        return 'bg-orange-600 text-white';
      case 'activity':
        return 'bg-purple-600 text-white';
      case 'transport':
        return 'bg-gray-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const TypeIcon = getTypeIcon(item.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700"
    >
      <div className="flex">
        {/* Image */}
        <div className="w-32 h-32 flex-shrink-0">
          <img
            src={item.image}
            alt={item.activity}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&fit=crop';
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                <TypeIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">{item.activity}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{item.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 mb-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-white">{item.rating}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-400">
                <DollarSign className="w-3 h-3" />
                <span>${item.cost}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-300 mb-3">
            {formatTextWithLineBreaks(item.description)}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Details
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-600 transition-colors"
            >
              Book Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-600 transition-colors"
            >
              Save
            </motion.button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-700">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
        />
      </div>
    </motion.div>
  );
};

export default ItineraryCard; 
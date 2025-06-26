import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Info } from 'lucide-react';
import { ItineraryItem } from '../types';

interface InteractiveMapProps {
  fromLocation: string;
  toLocation: string;
  itinerary: ItineraryItem[];
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  fromLocation, 
  toLocation, 
  itinerary 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In a real implementation, this would initialize Mapbox GL JS
    // For now, we'll create a mock interactive map
    if (mapRef.current) {
      mapRef.current.innerHTML = `
        <div style="
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          border-radius: 12px;
          overflow: hidden;
        ">
          <div style="
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(255, 255, 255, 0.9);
            padding: 12px;
            border-radius: 8px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          ">
            <div style="font-weight: 600; color: #1f2937; margin-bottom: 4px;">
              Route Overview
            </div>
            <div style="font-size: 14px; color: #6b7280;">
              ${fromLocation} → ${toLocation}
            </div>
          </div>
          
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            height: 60%;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            border: 2px dashed rgba(255, 255, 255, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 18px;
            font-weight: 500;
          ">
            Interactive Map View
            <br />
            <span style="font-size: 14px; opacity: 0.8;">
              (Mapbox GL JS Integration)
            </span>
          </div>
          
          <div style="
            position: absolute;
            bottom: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.9);
            padding: 12px;
            border-radius: 8px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          ">
            <div style="font-weight: 600; color: #1f2937; margin-bottom: 4px;">
              Trip Stops
            </div>
            <div style="font-size: 14px; color: #6b7280;">
              ${itinerary.length} locations planned
            </div>
          </div>
        </div>
      `;
    }
  }, [fromLocation, toLocation, itinerary]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors"
        >
          <Navigation className="w-5 h-5 text-gray-700" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors"
        >
          <Info className="w-5 h-5 text-gray-700" />
        </motion.button>
      </div>

      {/* Location Markers */}
      <div className="absolute inset-0 pointer-events-none">
        {itinerary.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="absolute"
            style={{
              left: `${20 + (index * 15)}%`,
              top: `${30 + (index % 2 * 20)}%`,
            }}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg p-2 whitespace-nowrap pointer-events-auto">
                <div className="text-xs font-medium text-gray-900">{item.activity}</div>
                <div className="text-xs text-gray-600">{item.location}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveMap; 
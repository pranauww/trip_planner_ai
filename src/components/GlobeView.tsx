import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Navigation, ZoomIn, ZoomOut } from 'lucide-react';

interface GlobeViewProps {
  fromLocation: string;
  toLocation: string;
}

const GlobeView: React.FC<GlobeViewProps> = ({ fromLocation, toLocation }) => {
  const globeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In a real implementation, this would initialize Three.js with a 3D globe
    // For now, we'll create a mock 3D globe visualization
    if (globeRef.current) {
      globeRef.current.innerHTML = `
        <div style="
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, #1e3a8a 0%, #1e1b4b 100%);
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 200px;
            height: 200px;
            background: radial-gradient(circle at 30% 30%, #60a5fa 0%, #3b82f6 50%, #1e40af 100%);
            border-radius: 50%;
            position: relative;
            box-shadow: 
              0 0 50px rgba(59, 130, 246, 0.5),
              inset 0 0 50px rgba(0, 0, 0, 0.3);
            animation: rotate 20s linear infinite;
          ">
            <div style="
              position: absolute;
              top: 20%;
              left: 30%;
              width: 40px;
              height: 40px;
              background: rgba(34, 197, 94, 0.8);
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
            "></div>
            <div style="
              position: absolute;
              bottom: 25%;
              right: 20%;
              width: 40px;
              height: 40px;
              background: rgba(239, 68, 68, 0.8);
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
            "></div>
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 2px;
              height: 100px;
              background: linear-gradient(to bottom, transparent, #fbbf24, transparent);
              transform-origin: center;
              animation: pulse 2s ease-in-out infinite;
            "></div>
          </div>
          
          <div style="
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 12px;
            border-radius: 8px;
            color: white;
            font-size: 14px;
          ">
            <div style="font-weight: 600; margin-bottom: 4px;">3D Globe View</div>
            <div style="opacity: 0.8;">Route: ${fromLocation} → ${toLocation}</div>
          </div>
          
          <style>
            @keyframes rotate {
              from { transform: rotateY(0deg); }
              to { transform: rotateY(360deg); }
            }
            @keyframes pulse {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 1; }
            }
          </style>
        </div>
      `;
    }
  }, [fromLocation, toLocation]);

  return (
    <div className="relative w-full h-full">
      <div ref={globeRef} className="w-full h-full" />
      
      {/* Globe Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
        >
          <ZoomIn className="w-5 h-5 text-white" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
        >
          <ZoomOut className="w-5 h-5 text-white" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
        >
          <Navigation className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* Location Labels */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute top-1/4 left-1/4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg"
        >
          <div className="text-xs font-medium text-gray-900">{fromLocation}</div>
          <div className="text-xs text-gray-600">Starting Point</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="absolute bottom-1/4 right-1/4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg"
        >
          <div className="text-xs font-medium text-gray-900">{toLocation}</div>
          <div className="text-xs text-gray-600">Destination</div>
        </motion.div>
      </div>

      {/* Route Line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1 }}
          d="M 25% 25% Q 50% 10% 75% 75%"
          stroke="#fbbf24"
          strokeWidth="3"
          fill="none"
          strokeDasharray="5,5"
          style={{ filter: 'drop-shadow(0 0 5px rgba(251, 191, 36, 0.5))' }}
        />
      </svg>
    </div>
  );
};

export default GlobeView; 
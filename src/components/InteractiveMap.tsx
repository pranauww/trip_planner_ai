import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Info } from 'lucide-react';
import { ItineraryItem } from '../types';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN;
    
    if (!mapboxToken) {
      console.warn('Mapbox token not found. Using fallback map.');
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    if (map.current) return; // Initialize map only once

    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-122.4194, 37.7749], // San Francisco default
        zoom: 10
      });

      map.current.on('load', () => {
        if (!map.current) return;

        // Add route line
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [-121.7405, 38.5449], // Davis, CA
                [-122.4194, 37.7749]  // San Francisco, CA
              ]
            }
          }
        });

        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 4,
            'line-dasharray': [2, 2]
          }
        });

        // Add markers for itinerary items
        itinerary.forEach((item, index) => {
          // Generate coordinates based on item location (simplified)
          const coordinates = getCoordinatesForLocation(item.location);
          
          // Create marker element
          const markerEl = document.createElement('div');
          markerEl.className = 'marker';
          markerEl.style.width = '30px';
          markerEl.style.height = '30px';
          markerEl.style.background = '#3b82f6';
          markerEl.style.borderRadius = '50%';
          markerEl.style.border = '3px solid white';
          markerEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
          markerEl.style.cursor = 'pointer';

          // Add marker to map
          if (map.current) {
            new mapboxgl.Marker(markerEl)
              .setLngLat(coordinates)
              .setPopup(
                new mapboxgl.Popup({ offset: 25 })
                  .setHTML(`
                    <div style="padding: 8px;">
                      <h3 style="margin: 0 0 4px 0; font-weight: 600;">${item.activity}</h3>
                      <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${item.location}</p>
                      <p style="margin: 0; font-size: 12px; color: #666;">$${item.cost} • ⭐ ${item.rating}</p>
                    </div>
                  `)
              )
              .addTo(map.current);
          }
        });

        // Fit map to show all markers and route
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend([-121.7405, 38.5449]); // Davis
        bounds.extend([-122.4194, 37.7749]); // San Francisco
        
        itinerary.forEach(item => {
          const coords = getCoordinatesForLocation(item.location);
          bounds.extend(coords);
        });

        if (map.current) {
          map.current.fitBounds(bounds, { padding: 50 });
        }
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [fromLocation, toLocation, itinerary]);

  // Helper function to get coordinates for locations (simplified)
  const getCoordinatesForLocation = (location: string): [number, number] => {
    // This is a simplified mapping - in a real app, you'd use geocoding
    const locationMap: { [key: string]: [number, number] } = {
      'Davis': [-121.7405, 38.5449],
      'San Francisco': [-122.4194, 37.7749],
      'Fisherman\'s Wharf': [-122.4094, 37.8087],
      'Golden Gate Bridge': [-122.4783, 37.8199],
      'Union Square': [-122.4084, 37.7879],
      'Alcatraz': [-122.4223, 37.8270],
      'Twin Peaks': [-122.4474, 37.7516],
      'Civic Center': [-122.4174, 37.7793],
      'North Beach': [-122.4104, 37.8002],
      'Market Street': [-122.4004, 37.7849]
    };

    // Try to find exact match
    for (const [key, coords] of Object.entries(locationMap)) {
      if (location.toLowerCase().includes(key.toLowerCase())) {
        return coords;
      }
    }

    // Default to San Francisco if no match found
    return [-122.4194, 37.7749];
  };

  // Fallback for when Mapbox token is not available
  if (!process.env.REACT_APP_MAPBOX_TOKEN) {
    return (
      <div className="relative w-full h-full">
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Interactive Map</h3>
            <p className="text-gray-600 text-sm">
              Add your Mapbox token to see the interactive map
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Route: {fromLocation} → {toLocation}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-xl" />
      
      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => map.current?.flyTo({ center: [-122.4194, 37.7749], zoom: 12 })}
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

      {/* Route Info Overlay */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-sm font-medium text-gray-900 mb-1">Route Overview</div>
        <div className="text-xs text-gray-600">
          {fromLocation} → {toLocation}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {itinerary.length} stops planned
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap; 
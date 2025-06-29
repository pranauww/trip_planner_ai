import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { 
  Plane, 
  Car, 
  Building, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  Heart,
  Send,
  Camera,
  Coffee,
  Mountain,
  Waves,
  Utensils,
  ShoppingBag,
  X
} from 'lucide-react';
import { TripData } from '../types';

interface TripFormProps {
  onComplete: (data: TripData) => void;
}

const TripForm: React.FC<TripFormProps> = ({ onComplete }) => {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<TripData>();
  
  const [budget, setBudget] = useState(1000);
  const [people, setPeople] = useState(2);

  const tripTypes = [
    { id: 'vacation', label: 'Vacation', icon: Plane, color: 'bg-blue-500' },
    { id: 'business', label: 'Business', icon: Building, color: 'bg-gray-500' },
    { id: 'roadtrip', label: 'Road Trip', icon: Car, color: 'bg-green-500' },
    { id: 'weekend', label: 'Weekend Getaway', icon: Calendar, color: 'bg-purple-500' },
    { id: 'daytrip', label: 'Day Trip', icon: MapPin, color: 'bg-orange-500' },
  ];

  const preferences = [
    { id: 'adventure', label: 'Adventure', icon: Mountain },
    { id: 'relaxation', label: 'Relaxation', icon: Waves },
    { id: 'food', label: 'Food & Dining', icon: Utensils },
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
    { id: 'culture', label: 'Culture', icon: Building },
    { id: 'nature', label: 'Nature', icon: Mountain },
    { id: 'nightlife', label: 'Nightlife', icon: Coffee },
    { id: 'photography', label: 'Photography', icon: Camera },
  ];

  const togglePreference = (pref: string) => {
    setSelectedPreferences(prev => 
      prev.includes(pref) 
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    );
  };

  const onSubmitForm = (data: TripData) => {
    onComplete({
      ...data,
      budget: budget,
      people: people,
      preferences: selectedPreferences,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Trip Details
        </h2>
        <p className="text-gray-400 text-sm">
          Fill in what you know - all fields are optional!
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="flex-1 flex flex-col space-y-6">
        {/* Trip Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Trip Type (Optional)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {tripTypes.map((type) => (
              <label
                key={type.id}
                className="relative cursor-pointer group"
              >
                <input
                  type="radio"
                  value={type.id}
                  {...register('tripType')}
                  className="sr-only"
                />
                <div className="flex flex-col items-center p-3 border-2 border-gray-600 rounded-lg hover:border-blue-400 transition-colors group-hover:scale-105 bg-gray-700">
                  <div className={`w-8 h-8 rounded-full ${type.color} flex items-center justify-center mb-1`}>
                    <type.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-300">{type.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Location Inputs */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              From (Optional)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Starting location"
                {...register('fromLocation')}
                className="w-full pl-9 pr-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              To (Optional)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Destination"
                {...register('toLocation')}
                className="w-full pl-9 pr-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Start Date (Optional)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                {...register('startDate')}
                className="w-full pl-9 pr-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              End Date (Optional)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                {...register('endDate')}
                className="w-full pl-9 pr-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
              />
            </div>
          </div>
        </div>

        {/* Budget Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Budget: {formatCurrency(budget)}
          </label>
          <div className="relative">
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>$100</span>
              <span>$10,000</span>
            </div>
          </div>
        </div>

        {/* People Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Number of People: {people}
          </label>
          <div className="relative">
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={people}
              onChange={(e) => setPeople(Number(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1</span>
              <span>10</span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Interests (Optional)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {preferences.map((pref) => (
              <button
                key={pref.id}
                type="button"
                onClick={() => togglePreference(pref.id)}
                className={`flex items-center space-x-2 p-2 rounded-lg border-2 transition-all text-xs ${
                  selectedPreferences.includes(pref.id)
                    ? 'border-blue-500 bg-blue-600 text-white'
                    : 'border-gray-600 hover:border-gray-500 text-gray-300 bg-gray-700'
                }`}
              >
                <pref.icon className="w-3 h-3" />
                <span className="font-medium">{pref.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            placeholder="Any special requirements, must-see places, or preferences..."
            {...register('notes')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-700 text-white placeholder-gray-400"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 mt-auto"
        >
          <Send className="w-4 h-4" />
          <span>Start Planning</span>
        </motion.button>
      </form>
    </div>
  );
};

export default TripForm; 
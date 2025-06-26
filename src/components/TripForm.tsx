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
  ShoppingBag
} from 'lucide-react';
import { TripData } from '../types';

interface TripFormProps {
  onSubmit: (data: TripData) => void;
}

const TripForm: React.FC<TripFormProps> = ({ onSubmit }) => {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<TripData>();

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
    onSubmit({
      ...data,
      preferences: selectedPreferences,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Plan Your Perfect Trip
        </h2>
        <p className="text-gray-600">
          Tell us about your journey and let AI create the perfect itinerary
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
        {/* Trip Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            What type of trip are you planning?
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {tripTypes.map((type) => (
              <label
                key={type.id}
                className="relative cursor-pointer group"
              >
                <input
                  type="radio"
                  value={type.id}
                  {...register('tripType', { required: 'Please select a trip type' })}
                  className="sr-only"
                />
                <div className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors group-hover:scale-105">
                  <div className={`w-12 h-12 rounded-full ${type.color} flex items-center justify-center mb-2`}>
                    <type.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{type.label}</span>
                </div>
              </label>
            ))}
          </div>
          {errors.tripType && (
            <p className="mt-2 text-sm text-red-600">{errors.tripType.message}</p>
          )}
        </div>

        {/* Location Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Starting location"
                {...register('fromLocation', { required: 'Starting location is required' })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {errors.fromLocation && (
              <p className="mt-2 text-sm text-red-600">{errors.fromLocation.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Destination"
                {...register('toLocation', { required: 'Destination is required' })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {errors.toLocation && (
              <p className="mt-2 text-sm text-red-600">{errors.toLocation.message}</p>
            )}
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                {...register('startDate', { required: 'Start date is required' })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {errors.startDate && (
              <p className="mt-2 text-sm text-red-600">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                {...register('endDate', { required: 'End date is required' })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {errors.endDate && (
              <p className="mt-2 text-sm text-red-600">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        {/* Budget and People */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget (USD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                placeholder="1000"
                {...register('budget', { 
                  required: 'Budget is required',
                  min: { value: 1, message: 'Budget must be positive' }
                })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {errors.budget && (
              <p className="mt-2 text-sm text-red-600">{errors.budget.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of People
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                placeholder="2"
                {...register('people', { 
                  required: 'Number of people is required',
                  min: { value: 1, message: 'Must be at least 1 person' }
                })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {errors.people && (
              <p className="mt-2 text-sm text-red-600">{errors.people.message}</p>
            )}
          </div>
        </div>

        {/* Preferences */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            What interests you? (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {preferences.map((pref) => (
              <button
                key={pref.id}
                type="button"
                onClick={() => togglePreference(pref.id)}
                className={`flex items-center space-x-2 p-3 rounded-xl border-2 transition-all ${
                  selectedPreferences.includes(pref.id)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <pref.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{pref.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            placeholder="Any special requirements, must-see places, or preferences..."
            {...register('notes')}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Send className="w-5 h-5" />
          <span>Start Planning My Trip</span>
        </motion.button>
      </form>
    </motion.div>
  );
};

export default TripForm; 
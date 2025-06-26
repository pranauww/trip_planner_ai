export interface TripData {
  tripType: 'vacation' | 'business' | 'road-trip' | 'weekend-getaway' | 'day-trip';
  fromLocation: string;
  toLocation: string;
  startDate: string;
  endDate: string;
  budget: number;
  people: number;
  preferences: string[];
  notes?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface ItineraryItem {
  id: string;
  day: number;
  time: string;
  activity: string;
  location: string;
  description: string;
  type: 'flight' | 'hotel' | 'activity' | 'food' | 'transport' | 'restaurant';
  cost: number;
  rating: number;
  image: string;
}

export interface TravelRecommendation {
  type: 'hotel' | 'restaurant' | 'activity' | 'flight' | 'transport';
  name: string;
  description: string;
  location: string;
  cost?: number;
  rating?: number;
  image?: string;
  bookingUrl?: string;
}

export interface AIResponse {
  message: string;
  recommendations?: TravelRecommendation[];
  itinerary?: {
    day: number;
    activities: TravelRecommendation[];
  }[];
} 
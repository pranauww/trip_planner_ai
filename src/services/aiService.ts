import OpenAI from 'openai';
import { TripData, ChatMessage, TravelRecommendation, AIResponse } from '../types';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, you should use a backend proxy
});

export class AIService {
  static async generateResponse(
    userMessage: string,
    tripData: TripData,
    chatHistory: ChatMessage[]
  ): Promise<AIResponse> {
    try {
      // Build context from available trip data
      const contextParts = [];
      if (tripData.tripType) contextParts.push(`Trip type: ${tripData.tripType}`);
      if (tripData.fromLocation) contextParts.push(`From: ${tripData.fromLocation}`);
      if (tripData.toLocation) contextParts.push(`To: ${tripData.toLocation}`);
      if (tripData.startDate && tripData.endDate) contextParts.push(`Dates: ${tripData.startDate} to ${tripData.endDate}`);
      if (tripData.budget) contextParts.push(`Budget: $${tripData.budget}`);
      if (tripData.people) contextParts.push(`People: ${tripData.people}`);
      if (tripData.preferences && tripData.preferences.length > 0) contextParts.push(`Preferences: ${tripData.preferences.join(', ')}`);
      
      const tripContext = contextParts.length > 0 ? contextParts.join('\n- ') : 'No specific trip details provided yet';

      const systemPrompt = `You are an expert travel planner AI assistant. You help users plan their trips by providing personalized recommendations and creating detailed itineraries.

Current trip context:
- ${tripContext}

Your responses should be:
1. Helpful and conversational
2. Include specific recommendations when asked
3. Provide realistic costs and ratings
4. Suggest activities that match the user's preferences (if provided)
5. Consider the budget and trip duration (if provided)

IMPORTANT: If the user hasn't provided enough information for a specific recommendation, provide a general response and suggest what additional information would be helpful. For example:
- If no destination is specified, suggest popular destinations and ask where they'd like to go
- If no budget is mentioned, provide a range of options and ask about their budget
- If no dates are given, ask about their preferred travel dates
- If no preferences are listed, ask about their interests

When providing recommendations, embed them naturally in your response as JSON objects. Here's the exact format:

For example, if recommending a restaurant, write:
"I recommend trying the local cuisine at { "type": "restaurant", "name": "Restaurant Name", "description": "Brief description", "location": "Address", "cost": 25, "rating": 4.5, "image": "https://images.unsplash.com/photo-...", "bookingUrl": "https://booking.com/..." }"

IMPORTANT: 
- Do NOT wrap JSON in \`\`\`json code blocks
- Embed the JSON objects directly in your natural language response
- Include all required fields: type, name, description, location, cost, rating, image, bookingUrl
- Use realistic values for cost and rating
- For images, use specific Unsplash URLs that match the location and type. Choose from these options:
  * Hotels: https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&fit=crop (luxury), https://images.unsplash.com/photo-1501117716987-c8c394bb29aa?w=400&fit=crop (boutique), https://images.unsplash.com/photo-1561409037-1418489f0b65?w=400&fit=crop (hostel)
  * Restaurants: https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&fit=crop (fine dining), https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&fit=crop (casual), https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&fit=crop (street food)
  * Activities: https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&fit=crop (city tour), https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&fit=crop (nature), https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&fit=crop (museums)
  * Flights: https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&fit=crop (airplane), https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=400&fit=crop (airport)
  * Transport: https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&fit=crop (car), https://images.unsplash.com/photo-1570125909232-eb263c188fe7?w=400&fit=crop (public transport)

At the end of your response, if the user hasn't provided enough information for a complete recommendation, add a helpful note like: "To provide more specific recommendations, it would be helpful to know [missing information]."`;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...chatHistory.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content: userMessage }
      ];

      console.log('Sending request to OpenAI...');
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 1000,
      });

      const response = completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response at the moment.';
      console.log('OpenAI response received:', response.substring(0, 300) + '...');

      // Try to extract recommendations from the response
      const recommendations = this.extractRecommendations(response);
      console.log('Extracted recommendations:', recommendations);

      // Clean the response text by removing JSON objects
      const cleanedResponse = this.cleanResponseText(response);

      return {
        message: cleanedResponse,
        recommendations: recommendations.length > 0 ? recommendations : undefined
      };

    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return {
        message: 'I apologize, but I\'m having trouble connecting to my AI services right now. Please try again in a moment.'
      };
    }
  }

  static async generateItinerary(tripData: TripData, chatHistory: ChatMessage[]): Promise<AIResponse> {
    try {
      // Build context from available trip data
      const contextParts = [];
      if (tripData.tripType) contextParts.push(`Type: ${tripData.tripType}`);
      if (tripData.fromLocation) contextParts.push(`From: ${tripData.fromLocation}`);
      if (tripData.toLocation) contextParts.push(`To: ${tripData.toLocation}`);
      if (tripData.startDate && tripData.endDate) contextParts.push(`Dates: ${tripData.startDate} to ${tripData.endDate}`);
      if (tripData.budget) contextParts.push(`Budget: $${tripData.budget}`);
      if (tripData.people) contextParts.push(`People: ${tripData.people}`);
      if (tripData.preferences && tripData.preferences.length > 0) contextParts.push(`Preferences: ${tripData.preferences.join(', ')}`);
      
      const tripContext = contextParts.length > 0 ? contextParts.join('\n- ') : 'No specific trip details provided yet';

      const systemPrompt = `Create a detailed day-by-day itinerary for this trip:

Trip Details:
- ${tripContext}

Please provide:
1. A natural language summary of the itinerary
2. Specific recommendations for each day including hotels, restaurants, activities, and transport
3. Realistic costs and timing
4. Options that fit within the budget (if provided)

If specific details are missing (like destination, dates, or budget), create a general itinerary template and suggest what additional information would make it more specific.

Embed recommendations naturally in your response as JSON objects with this format:
{ "type": "hotel|restaurant|activity|flight|transport", "name": "Name", "description": "Description", "location": "Address", "cost": 25, "rating": 4.5, "image": "https://images.unsplash.com/photo-...", "bookingUrl": "https://booking.com/..." }

IMPORTANT: 
- Do NOT wrap JSON in \`\`\`json code blocks
- Embed the JSON objects directly in your natural language response
- Include all required fields: type, name, description, location, cost, rating, image, bookingUrl
- Use realistic values for cost and rating

If trip details are incomplete, provide a template itinerary and suggest what additional information would make it more personalized.`;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...chatHistory.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content: 'Please create a detailed day-by-day itinerary for my trip.' }
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 1500,
      });

      const response = completion.choices[0]?.message?.content || 'I couldn\'t generate an itinerary at the moment.';
      const recommendations = this.extractRecommendations(response);

      return {
        message: response,
        recommendations: recommendations.length > 0 ? recommendations : undefined
      };

    } catch (error) {
      console.error('Error generating itinerary:', error);
      return {
        message: 'I apologize, but I\'m having trouble creating your itinerary right now. Please try again in a moment.'
      };
    }
  }

  private static extractRecommendations(response: string): TravelRecommendation[] {
    const recommendations: TravelRecommendation[] = [];
    
    console.log('Extracting recommendations from response:', response.substring(0, 200) + '...');
    
    // First, try to find JSON objects using a more flexible approach
    // Look for patterns like { "type": "hotel", ... }
    const jsonMatches = response.match(/\{\s*"type"\s*:\s*"[^"]+"[^}]*\}/g);
    
    if (jsonMatches) {
      console.log('Found JSON matches:', jsonMatches.length);
      jsonMatches.forEach((match, index) => {
        try {
          console.log(`Attempting to parse JSON ${index + 1}:`, match);
          const parsed = JSON.parse(match);
          
          // Validate that we have the required fields
          if (parsed.type && parsed.name && parsed.description) {
            console.log(`Successfully parsed recommendation ${index + 1}:`, parsed.name);
            recommendations.push({
              type: parsed.type,
              name: parsed.name,
              description: parsed.description,
              location: parsed.location || 'Location not specified',
              cost: parsed.cost || Math.floor(Math.random() * 200) + 50,
              rating: parsed.rating || (Math.random() * 2 + 3).toFixed(1),
              image: parsed.image || this.getDefaultImage(parsed.type),
              bookingUrl: parsed.bookingUrl || '#'
            });
          } else {
            console.log(`JSON ${index + 1} missing required fields:`, parsed);
          }
        } catch (e) {
          console.log(`Failed to parse JSON ${index + 1}:`, e);
          console.log('Problematic JSON string:', match);
        }
      });
    } else {
      console.log('No JSON matches found with primary pattern');
      
      // Fallback: try to find any JSON-like structure
      const fallbackMatches = response.match(/\{[^}]*"type"[^}]*\}/g);
      if (fallbackMatches) {
        console.log('Found fallback JSON matches:', fallbackMatches.length);
        fallbackMatches.forEach((match, index) => {
          try {
            console.log(`Attempting to parse fallback JSON ${index + 1}:`, match);
            const parsed = JSON.parse(match);
            if (parsed.type && parsed.name && parsed.description) {
              recommendations.push({
                type: parsed.type,
                name: parsed.name,
                description: parsed.description,
                location: parsed.location || 'Location not specified',
                cost: parsed.cost || Math.floor(Math.random() * 200) + 50,
                rating: parsed.rating || (Math.random() * 2 + 3).toFixed(1),
                image: parsed.image || this.getDefaultImage(parsed.type),
                bookingUrl: parsed.bookingUrl || '#'
              });
            }
          } catch (e) {
            console.log(`Failed to parse fallback JSON ${index + 1}:`, e);
          }
        });
      }
    }

    console.log('Final recommendations extracted:', recommendations.length);
    return recommendations;
  }

  private static getDefaultImage(type: string): string {
    const images = {
      hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&fit=crop',
      restaurant: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&fit=crop',
      activity: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&fit=crop',
      flight: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&fit=crop',
      transport: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&fit=crop'
    };
    return images[type as keyof typeof images] || images.activity;
  }

  // Test function to verify parsing works
  static testParsing() {
    const testResponse = `Of course, I have found a couple of budget-friendly hotels in San Francisco that might be to your liking. The first one is { "type": "hotel", "name": "The Mosser", "description": "An historic hotel centrally located in downtown San Francisco, near the Powell Street Cable Cars and Powell BART station.", "location": "54 4th St, San Francisco, CA 94103, United States", "cost": 90, "rating": 3.9, "image": "https://images.unsplash.com/photo-1501117716987-c8c394bb29aa", "bookingUrl": "https://www.booking.com/hotel/us/the-mosser.html" } Another good option is { "type": "hotel", "name": "Adelaide Hostel", "description": "Quaint hostel in a Victorian townhouse offering dorms & private rooms, plus free breakfast & Wi-Fi.", "location": "5 Isadora Duncan Ln, San Francisco, CA 94102, United States", "cost": 60, "rating": 4.1, "image": "https://images.unsplash.com/photo-1561409037-1418489f0b65", "bookingUrl": "https://www.booking.com/hotel/us/adelaide-hostel.html" } These are great options for a budget stay, leaving you with enough to explore and enjoy the city.`;
    
    console.log('Testing parsing with sample response...');
    console.log('Response length:', testResponse.length);
    console.log('Response preview:', testResponse.substring(0, 200) + '...');
    
    const results = this.extractRecommendations(testResponse);
    console.log('Test results:', results);
    
    // Test text cleaning
    const cleanedText = this.cleanResponseText(testResponse);
    console.log('Cleaned text:', cleanedText);
    
    return results;
  }

  private static cleanResponseText(response: string): string {
    // Remove JSON objects from the response text to make it readable
    // This regex matches JSON objects that start with { and contain "type"
    const cleanedText = response.replace(/\{\s*"type"\s*:\s*"[^"]+"[^}]*\}/g, '');
    
    // Clean up any extra whitespace and punctuation that might be left
    const finalText = cleanedText
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\s*,\s*/g, ', ') // Clean up commas
      .replace(/\s*\.\s*/g, '. ') // Clean up periods
      .replace(/\s*!\s*/g, '! ') // Clean up exclamation marks
      .replace(/\s*\?\s*/g, '? ') // Clean up question marks
      .trim();
    
    console.log('Cleaned response text:', finalText);
    return finalText;
  }
} 
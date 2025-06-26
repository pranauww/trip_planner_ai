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
      const systemPrompt = `You are an expert travel planner AI assistant. You help users plan their trips by providing personalized recommendations and creating detailed itineraries.

Current trip context:
- Trip type: ${tripData.tripType}
- From: ${tripData.fromLocation}
- To: ${tripData.toLocation}
- Dates: ${tripData.startDate} to ${tripData.endDate}
- Budget: $${tripData.budget}
- People: ${tripData.people}
- Preferences: ${tripData.preferences.join(', ')}

Your responses should be:
1. Helpful and conversational
2. Include specific recommendations when asked
3. Provide realistic costs and ratings
4. Suggest activities that match the user's preferences
5. Consider the budget and trip duration

When providing recommendations, embed them naturally in your response as JSON objects. Here's the exact format:

For example, if recommending a restaurant, write:
"I recommend trying the local cuisine at { "type": "restaurant", "name": "Restaurant Name", "description": "Brief description", "location": "Address", "cost": 25, "rating": 4.5, "image": "https://images.unsplash.com/photo-...", "bookingUrl": "https://booking.com/..." }"

IMPORTANT: 
- Do NOT wrap JSON in \`\`\`json code blocks
- Embed the JSON objects directly in your natural language response
- Include all required fields: type, name, description, location, cost, rating, image, bookingUrl
- Use realistic values for cost and rating

Respond naturally to the user's message and include relevant recommendations when appropriate.`;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...chatHistory.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content: userMessage }
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 1000,
      });

      const response = completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response at the moment.';

      // Try to extract recommendations from the response
      const recommendations = this.extractRecommendations(response);

      return {
        message: response,
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
      const systemPrompt = `Create a detailed day-by-day itinerary for this trip:

Trip Details:
- Type: ${tripData.tripType}
- From: ${tripData.fromLocation}
- To: ${tripData.toLocation}
- Dates: ${tripData.startDate} to ${tripData.endDate}
- Budget: $${tripData.budget}
- People: ${tripData.people}
- Preferences: ${tripData.preferences.join(', ')}

Please provide:
1. A natural language summary of the itinerary
2. Specific recommendations for each day including hotels, restaurants, activities, and transport
3. Realistic costs and timing
4. Options that fit within the budget

Embed recommendations naturally in your response as JSON objects with this format:
{ "type": "hotel|restaurant|activity|flight|transport", "name": "Name", "description": "Description", "location": "Address", "cost": 25, "rating": 4.5, "image": "https://images.unsplash.com/photo-...", "bookingUrl": "https://booking.com/..." }

IMPORTANT: 
- Do NOT wrap JSON in \`\`\`json code blocks
- Embed the JSON objects directly in your natural language response
- Include all required fields: type, name, description, location, cost, rating, image, bookingUrl
- Use realistic values for cost and rating`;

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
    
    // Look for JSON wrapped in markdown code blocks (```json ... ```)
    const codeBlockMatches = response.match(/```json\s*([\s\S]*?)\s*```/g);
    
    if (codeBlockMatches) {
      console.log('Found code block matches:', codeBlockMatches.length);
      codeBlockMatches.forEach((match, index) => {
        try {
          // Extract the JSON content from the code block
          const jsonMatch = match.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch && jsonMatch[1]) {
            console.log(`Parsing code block ${index + 1}:`, jsonMatch[1]);
            const parsed = JSON.parse(jsonMatch[1]);
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
          }
        } catch (e) {
          console.log('Failed to parse JSON from code block:', e);
        }
      });
    }
    
    // Look for standalone JSON objects embedded in text
    if (recommendations.length === 0) {
      console.log('No code blocks found, looking for embedded JSON...');
      
      // More comprehensive regex to find JSON objects with all required fields
      const jsonPattern = /\{\s*"type"\s*:\s*"[^"]+"\s*,\s*"name"\s*:\s*"[^"]+"\s*,\s*"description"\s*:\s*"[^"]+"[^}]*\}/g;
      const jsonMatches = response.match(jsonPattern);
      
      if (jsonMatches) {
        console.log('Found embedded JSON matches:', jsonMatches.length);
        jsonMatches.forEach((match, index) => {
          try {
            console.log(`Parsing embedded JSON ${index + 1}:`, match);
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
            console.log('Failed to parse embedded JSON:', e);
          }
        });
      }
      
      // Fallback: simpler regex for basic JSON objects
      if (recommendations.length === 0) {
        console.log('No embedded JSON found, trying simple pattern...');
        const simpleMatches = response.match(/\{[^{}]*"type"[^{}]*\}/g);
        
        if (simpleMatches) {
          console.log('Found simple JSON matches:', simpleMatches.length);
          simpleMatches.forEach((match, index) => {
            try {
              console.log(`Parsing simple JSON ${index + 1}:`, match);
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
              console.log('Failed to parse simple JSON:', e);
            }
          });
        }
      }
    }

    console.log('Final recommendations extracted:', recommendations.length);
    return recommendations;
  }

  private static getDefaultImage(type: string): string {
    const images = {
      hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
      restaurant: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
      activity: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
      flight: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400',
      transport: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'
    };
    return images[type as keyof typeof images] || images.activity;
  }

  // Test function to verify parsing works
  static testParsing() {
    const testResponse = `Absolutely. There are a number of scenic spots along the way from Davis to San Francisco. Here are a few: 1. The Suisun Valley in Fairfield is an underrated gem. It's a great place for photography and appreciating nature. You can stop at one of the vineyards for a wine tasting or simply enjoy the beautiful landscapes. { "type": "activity", "name": "Suisun Valley", "description": "Scenic vineyards and rolling hills, perfect for a picnic stop or wine tasting.", "location": "Suisun Valley, Fairfield, CA", "cost": 0, "rating": 4.5, "image": "https://images.unsplash.com/photo-1504610926078-a1611febcad3", "bookingUrl": "https://www.visitfairfieldca.com/directory/suisun-valley/" } 2. The Muir Woods National Monument is a bit off your route, but it's worth the detour if you have time. The towering redwoods are a sight to behold. { "type": "activity", "name": "Muir Woods National Monument", "description": "An iconic forest of towering redwoods. Walking trails suitable for all ages.", "location": "1 Muir Woods Rd, Mill Valley, CA 94941", "cost": 15, "rating": 4.7, "image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40", "bookingUrl": "https://www.nps.gov/muwo/index.htm" } 3. Lastly, Point Reyes National Seashore offers stunning views of the Pacific Ocean and has beautiful trails for hiking. { "type": "activity", "name": "Point Reyes National Seashore", "description": "A vast expanse of protected coastline in Marin County. Beaches, cliffs, and wildlife.", "location": "Point Reyes Station, CA 94956", "cost": 0, "rating": 4.8, "image": "https://images.unsplash.com/photo-1534081333815-ae5019106622", "bookingUrl": "https://www.nps.gov/pore/index.htm" } Please note that the cost mentioned is per person. Let me know if you want more information on other aspects of your trip.`;
    
    console.log('Testing parsing with sample response...');
    const results = this.extractRecommendations(testResponse);
    console.log('Test results:', results);
    return results;
  }
} 
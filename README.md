# Travel AI Companion

An AI-powered travel planning application with a visual-first interface that transforms your trip ideas into comprehensive itineraries through an intuitive form-based input system and dynamic visual representations.

## Features

### **Form-Based Input System**
- **Structured Data Collection**: Trip type, locations, dates, budget, and preferences
- **Visual Trip Type Selection**: Vacation, Business, Road Trip, Weekend Getaway, Day Trip
- **Smart Preference Selection**: Adventure, Relaxation, Food, Shopping, Culture, Nature, Nightlife, Photography
- **Real-time Validation**: Form validation with helpful error messages

### **AI Chat Interface**
- **Conversational Planning**: Natural language interaction with AI assistant
- **Context-Aware Responses**: AI remembers trip details and preferences
- **Quick Suggestions**: Pre-built prompts for common travel questions
- **Real-time Typing Indicators**: Visual feedback during AI processing
- **AI-Generated Recommendations**: Real hotel, restaurant, and activity suggestions

### **Visual Output Components**
- **Interactive Maps**: Route visualization with location markers
- **3D Globe View**: Animated globe showing travel route
- **Day-by-Day Itinerary**: Detailed schedule with images and ratings
- **Visual Trip Summary**: Cost breakdown, duration, and traveler info

### **Modern UI/UX**
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion powered transitions
- **Beautiful Gradients**: Modern color schemes and visual effects
- **Intuitive Navigation**: Tab-based interface for different views

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pranauww/trip_planner_ai.git
   cd trip_planner_ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Required: OpenAI API Configuration
   # Get your API key from: https://platform.openai.com/api-keys
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   
   # Optional: Mapbox API for enhanced map features
   # Get your token from: https://account.mapbox.com/access-tokens/
   REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## API Setup

### OpenAI API (Required)
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Generate a new API key
4. Add it to your `.env` file as `REACT_APP_OPENAI_API_KEY`

### Mapbox API (Optional)
1. Go to [Mapbox](https://account.mapbox.com/access-tokens/)
2. Create an account or sign in
3. Generate a new access token
4. Add it to your `.env` file as `REACT_APP_MAPBOX_TOKEN`

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Hook Form** - Form handling and validation
- **Lucide React** - Beautiful icon library

### AI & APIs
- **OpenAI GPT-4** - AI-powered travel recommendations and chat
- **Mapbox GL JS** - Interactive maps (ready for integration)
- **Three.js** - 3D globe visualization (ready for integration)

### UI Components
- **React Hot Toast** - Toast notifications
- **Date-fns** - Date manipulation utilities

## Usage

### 1. **Trip Planning Form**
- Select your trip type (vacation, business, road trip, etc.)
- Enter starting location and destination
- Choose travel dates
- Set budget and number of travelers
- Select interests and preferences
- Add any additional notes

### 2. **AI Chat Interface**
- Chat naturally with the AI about your trip
- Ask about specific activities, restaurants, or attractions
- Get personalized recommendations based on your preferences
- Use quick suggestion buttons for common questions
- View AI-generated recommendation cards with ratings and booking links

### 3. **Visual Itinerary**
- View your trip on an interactive map
- Explore the 3D globe view of your route
- Browse AI-generated day-by-day itinerary with detailed information
- See AI-generated insights about weather and local tips

## Key Features

### **Form-First Approach**
- Instead of conversational input for basic details, we use structured forms
- Reduces user effort for common trip planning tasks
- Ensures all necessary information is collected upfront

### **Enhanced Visual Experience**
- 3D globe visualization with animated routes
- Interactive maps with detailed location information
- Rich visual itinerary cards with images and ratings
- Dynamic progress indicators and animations

### **Universal Trip Planning**
- Supports any trip type from 2-hour road trips to international vacations
- Adapts interface based on trip duration and complexity
- Provides relevant suggestions for different trip types

### **Improved User Experience**
- Modern, intuitive interface with smooth animations
- Visual feedback throughout the planning process
- Easy navigation between different views
- Mobile-responsive design

### **Real AI Integration**
- Uses OpenAI GPT-4 for intelligent responses
- Generates personalized recommendations
- Provides realistic costs and ratings
- Creates detailed itineraries based on preferences

## Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here
```

### API Integration
The app is designed to integrate with:
- **OpenAI API** - For AI chat functionality and recommendations
- **Mapbox API** - For interactive maps
- **Travel APIs** - For real flight/hotel data

## Project Structure

```
src/
├── components/
│   ├── Header.tsx              # App header with navigation
│   ├── TripForm.tsx            # Main trip planning form
│   ├── ChatInterface.tsx       # AI chat interface with recommendations
│   ├── VisualOutput.tsx        # Main visual output container
│   ├── InteractiveMap.tsx      # Map visualization component
│   ├── GlobeView.tsx           # 3D globe component
│   └── ItineraryCard.tsx       # Individual itinerary item card
├── services/
│   └── aiService.ts            # OpenAI API integration
├── App.tsx                     # Main application component
├── index.tsx                   # Application entry point
└── index.css                   # Global styles and Tailwind imports
```

## Customization

### Styling
- Modify `tailwind.config.js` for custom colors and animations
- Update component styles in individual files
- Customize animations in `framer-motion` components

### Features
- Add new trip types in `TripForm.tsx`
- Extend AI responses in `ChatInterface.tsx`
- Enhance visual components with real API data
- Modify AI prompts in `aiService.ts`

## Acknowledgments

- Built with modern React and TypeScript best practices
- Uses beautiful UI libraries and tools from the open-source community
- Powered by OpenAI's GPT-4 for intelligent travel recommendations

---

**Ready to plan your next adventure?** 🗺️✈️ 

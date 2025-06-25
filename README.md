# 🧠 Travel AI Companion

An AI-powered travel planning application with a visual-first interface that transforms your trip ideas into comprehensive itineraries through an intuitive form-based input system and dynamic visual representations.

## ✨ Features

### 🎯 **Form-Based Input System**
- **Structured Data Collection**: Trip type, locations, dates, budget, and preferences
- **Visual Trip Type Selection**: Vacation, Business, Road Trip, Weekend Getaway, Day Trip
- **Smart Preference Selection**: Adventure, Relaxation, Food, Shopping, Culture, Nature, Nightlife, Photography
- **Real-time Validation**: Form validation with helpful error messages

### 🤖 **AI Chat Interface**
- **Conversational Planning**: Natural language interaction with AI assistant
- **Context-Aware Responses**: AI remembers trip details and preferences
- **Quick Suggestions**: Pre-built prompts for common travel questions
- **Real-time Typing Indicators**: Visual feedback during AI processing

### 🗺️ **Visual Output Components**
- **Interactive Maps**: Route visualization with location markers
- **3D Globe View**: Animated globe showing travel route
- **Day-by-Day Itinerary**: Detailed schedule with images and ratings
- **Visual Trip Summary**: Cost breakdown, duration, and traveler info

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion powered transitions
- **Beautiful Gradients**: Modern color schemes and visual effects
- **Intuitive Navigation**: Tab-based interface for different views

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd travel-ai-companion
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Hook Form** - Form handling and validation
- **Lucide React** - Beautiful icon library

### Maps & Visualization
- **Mapbox GL JS** - Interactive maps (ready for integration)
- **Three.js** - 3D globe visualization (ready for integration)
- **React Three Fiber** - React renderer for Three.js

### UI Components
- **Headless UI** - Accessible UI components
- **React Hot Toast** - Toast notifications
- **Date-fns** - Date manipulation utilities

## 📱 Usage

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

### 3. **Visual Itinerary**
- View your trip on an interactive map
- Explore the 3D globe view of your route
- Browse day-by-day itinerary with detailed information
- See AI-generated insights about weather and local tips

## 🎯 Key Differentiators from Mindtrip AI

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

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
```

### API Integration
The app is designed to integrate with:
- **OpenAI API** - For AI chat functionality
- **Mapbox API** - For interactive maps
- **Travel APIs** - For real flight/hotel data

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.tsx              # App header with navigation
│   ├── TripForm.tsx            # Main trip planning form
│   ├── ChatInterface.tsx       # AI chat interface
│   ├── VisualOutput.tsx        # Main visual output container
│   ├── InteractiveMap.tsx      # Map visualization component
│   ├── GlobeView.tsx           # 3D globe component
│   └── ItineraryCard.tsx       # Individual itinerary item card
├── App.tsx                     # Main application component
├── index.tsx                   # Application entry point
└── index.css                   # Global styles and Tailwind imports
```

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for custom colors and animations
- Update component styles in individual files
- Customize animations in `framer-motion` components

### Features
- Add new trip types in `TripForm.tsx`
- Extend AI responses in `ChatInterface.tsx`
- Enhance visual components with real API data

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload the build folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Mindtrip AI's innovative approach to travel planning
- Built with modern React and TypeScript best practices
- Uses beautiful UI libraries and tools from the open-source community

---

**Ready to plan your next adventure?** 🗺️✈️ 
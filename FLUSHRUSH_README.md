# 🚽 FlushRush

**Find accessible restrooms instantly on Northwestern's campus**

A mobile-first web app built with React, TypeScript, and TailwindCSS that helps students, staff, and visitors quickly locate the nearest accessible restroom based on their needs.

![Northwestern University](https://img.shields.io/badge/Northwestern-University-4E2A84)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?logo=tailwind-css)

---

## 🌟 Features

### ✅ Currently Implemented

- **🗺️ Interactive Map View**
  - Real-time visualization of your location and all restrooms
  - Color-coded markers (green for accessible, indigo for standard)
  - Click markers to view details
  - Smooth zoom and pan controls

- **📱 Optimized Screen Layout**
  - Full-screen map for maximum visibility
  - Toggle between map and list views
  - Floating "Nearest Restroom" card on map
  - Collapsible filters to save space

- **🎯 Smart Filtering**
  - ♿ Wheelchair accessible
  - 🚻 Gender-neutral
  - 🔓 No wildcard required
  - Live filtering on map and list

- **📍 Real-time Location**
  - Automatic geolocation
  - Distance and walk time calculations
  - Haversine formula for accuracy

- **♿ Accessibility First**
  - Detailed accessibility information
  - Visual status indicators
  - WCAG 2.1 AA compliant

- **⭐ Community Reviews**
  - Thumbs up/down ratings
  - Written reviews
  - Help others with your experience

- **🧭 Navigation Integration**
  - "Open in Maps" button
  - Direct link to Google Maps
  - Turn-by-turn directions

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/392-f25/FlushRush.git
cd FlushRush

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:5173/**

---

## 🎮 Usage

### Map View (Default)
1. **Allow location access** when prompted
2. **View the map** showing your location (purple marker) and restrooms (colored markers)
3. **Apply filters** at the top to narrow down options
4. **Check the nearest restroom** card at the top
5. **Click any marker** to see details
6. **Tap "Details"** to view full information and navigate

### List View
1. **Toggle to list view** using the button in the header
2. **Browse all restrooms** sorted by distance
3. **Tap any card** to view details
4. **Leave reviews** to help others

---

## 🏗️ Project Structure

```
FlushRush/
├── src/
│   ├── components/
│   │   ├── MapView.tsx           # Interactive Leaflet map
│   │   ├── FilterChips.tsx       # Filter toggle buttons
│   │   ├── RestroomCard.tsx      # Restroom list item
│   │   ├── RestroomDetail.tsx    # Detail view with navigation
│   │   ├── ReviewCard.tsx        # Individual review display
│   │   ├── AddReviewForm.tsx     # Review submission form
│   │   └── BottomSheet.tsx       # Modal bottom sheet
│   ├── types/
│   │   └── index.ts              # TypeScript definitions
│   ├── utils/
│   │   ├── geolocation.ts        # Location & distance calculations
│   │   └── filters.ts            # Filtering & sorting logic
│   ├── data/
│   │   └── sampleRestrooms.ts    # Northwestern campus data
│   ├── App.tsx                   # Main application
│   └── firebase.ts               # Firebase configuration
└── package.json
```

---

## 🎨 Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 19.2 with TypeScript |
| **Styling** | TailwindCSS 4.1 (utility-first) |
| **Maps** | Leaflet + React-Leaflet |
| **Build Tool** | Vite 7.1 |
| **Backend** | Firebase (Firestore, Auth, Storage) |
| **Testing** | Vitest + React Testing Library |
| **Geolocation** | Browser Geolocation API + Haversine |

---

## 🗺️ Map Features

- **Interactive Pan & Zoom**: Navigate the Northwestern campus
- **Custom Markers**:
  - 🟣 Purple dot: Your current location
  - 🟢 Green with ♿: Wheelchair accessible restroom
  - 🔵 Blue with 🚽: Standard restroom
- **Marker Popups**: Quick info when clicking markers
- **Map Legend**: Reference for all marker types
- **Responsive**: Works on mobile and desktop

---

## 📊 Sample Data

The app includes **8 sample restrooms** across Northwestern's Evanston campus:

1. **Technological Institute** - 1st Floor (Accessible, No Wildcard)
2. **Norris University Center** - Ground Floor (Accessible, Gender Neutral, No Wildcard)
3. **Main Library** - 2nd Floor (Accessible, Requires Wildcard after 10pm)
4. **Kresge Centennial Hall** - Basement
5. **Mudd Library** - 3rd Floor (Accessible, Gender Neutral, No Wildcard)
6. **Rebecca Crown Center** - 1st Floor (Accessible, Requires Wildcard)
7. **Blomquist Recreation Center** - Ground Floor (Accessible, Gender Neutral, No Wildcard)
8. **Frances Searle Building** - 2nd Floor (Accessible, No Wildcard)

---

## 🔮 Future Enhancements

- [ ] **Directions on Map**: Draw routes from user to restroom
- [ ] **Real-time Status**: Live availability updates
- [ ] **Indoor Mapping**: Floor-level navigation
- [ ] **User Authentication**: Northwestern NetID SSO
- [ ] **Photo Uploads**: Community-contributed images
- [ ] **Push Notifications**: Status change alerts
- [ ] **Offline Mode**: PWA with service workers
- [ ] **Crowd-sourced Updates**: Report closures/issues
- [ ] **Favorites**: Save preferred restrooms
- [ ] **Heat Map**: Show busiest times

---

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests with Vitest UI
npm run coverage     # Generate test coverage
npm run lint         # Run ESLint
```

---

## ♿ Accessibility

FlushRush follows **WCAG 2.1 AA** standards:

- ✅ Semantic HTML with proper landmarks
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ High contrast color schemes
- ✅ Focus indicators
- ✅ Screen reader compatible
- ✅ Touch targets 44x44px minimum
- ✅ Descriptive alt text

---

## 📱 Responsive Design

- **Mobile First**: Optimized for phones (320px+)
- **Tablet Support**: Enhanced layouts for tablets
- **Desktop Ready**: Full-screen experience on large displays
- **Touch Friendly**: Large tap targets and gestures

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 🐛 Known Issues

- Map tiles load from OpenStreetMap (requires internet)
- Location accuracy depends on device GPS
- Some browsers require HTTPS for geolocation

---

## 📄 License

This project is built for Northwestern University as part of a class project (CS 392, Fall 2025).

---

## 🙏 Acknowledgments

- **Northwestern University** for campus data inspiration
- **OpenStreetMap** contributors for map tiles
- **Leaflet** for the mapping library
- The **accessibility community** for feedback and guidance

---

## 📧 Contact & Support

For questions, issues, or suggestions:
- Open an issue on GitHub
- Contribute via Pull Request

---

**Built with 💜 for Northwestern University**

*Making campus more accessible for everyone, one restroom at a time.*

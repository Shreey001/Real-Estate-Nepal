# <div align="center">🏠 Nepal Real Estate App</div>

<div align="center">

[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Latest-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7.4-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![Prisma](https://img.shields.io/badge/Prisma-Latest-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

<p align="center">
  <img src="https://i.imgur.com/YourProjectDemo.gif" alt="Project Demo" width="680px" />
</p>

🌟 A modern real estate platform revolutionizing property search in Nepal with cutting-edge features and stunning UI/UX 🌟

[Demo](https://your-demo-link.com) · [Report Bug](https://github.com/yourusername/nepal-real-estate-app/issues) · [Request Feature](https://github.com/yourusername/nepal-real-estate-app/issues)

</div>

## ✨ Features & Animations

### 🗺️ Interactive Property Map

- **Smooth Map Interactions**
  - `Framer Motion` powered zoom and pan animations
  - Dynamic marker clustering with `react-map-gl`
  - Real-time location updates with smooth transitions
  - 3D building renders on hover

### 💬 Real-Time Chat with Style

- **Modern Chat Interface**
  - Typing indicators with animated dots
  - Message delivery status animations
  - Push notifications with subtle animations
  - Emoji reactions with pop animations
  - Voice messages with waveform visualization

### 🏢 Property Listings

- **Rich Media Experience**
  - 360° virtual tours using `react-360`
  - Image galleries with `react-photo-gallery`
  - Lazy loading with blur effects
  - Infinite scroll with skeleton loading
  - Price history charts using `recharts`

### 👤 User Experience

- **Polished Interactions**
  - Smooth page transitions with `framer-motion`
  - Loading states with `react-loading-skeleton`
  - Toast notifications using `react-hot-toast`
  - Form validations with animated feedback
  - Dark/Light theme toggle with transition effects

## 🎨 UI/UX Features

```jsx
// Example of our animated property card component
const PropertyCard = ({ property }) => {
  const animation = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.3 },
  };

  return (
    <motion.div
      {...animation}
      whileHover={{ scale: 1.05 }}
      className="property-card"
    >
      // Property details here
    </motion.div>
  );
};
```

## 🚀 Tech Stack

### Frontend Powerhouse

- **Core**

  - ⚛️ React 19 with Server Components
  - 📦 Vite for lightning-fast builds
  - 🎭 Framer Motion for fluid animations
  - 🎨 Tailwind CSS for styling
  - 🌐 React Query for data fetching

- **Map & Visualization**

  - 🗺️ Mapbox GL JS
  - 📊 Recharts for analytics
  - 🖼️ React Photo Gallery
  - 🎥 React 360 for virtual tours

- **Real-time Features**
  - 🔄 Socket.IO Client
  - 📱 Push Notifications
  - 💬 WebRTC for video tours

### Backend Architecture

- **Core**

  - 📡 Node.js & Express
  - 🔒 JWT & BCrypt
  - 📊 Prisma ORM
  - 🔄 Socket.IO

- **Database & Storage**
  - 🗄️ PostgreSQL
  - ☁️ AWS S3 for media
  - 🔍 Elasticsearch for search

## 🛠️ Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/nepal-real-estate-app.git
   cd nepal-real-estate-app
   ```

2. **Set up environment variables:**

   ```bash
   # Backend .env
   DATABASE_URL="postgresql://user:password@localhost:5432/realestate"
   JWT_SECRET="your-secret-key"
   MAPBOX_TOKEN="your-mapbox-token"
   AWS_ACCESS_KEY="your-aws-key"

   # Frontend .env
   VITE_API_URL="http://localhost:3000"
   VITE_MAPBOX_TOKEN="your-public-mapbox-token"
   ```

3. **Install dependencies:**

   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd client && npm install
   ```

4. **Start development servers:**

   ```bash
   # Terminal 1 - Backend
   npm run dev

   # Terminal 2 - Frontend
   cd client && npm run dev
   ```

## 📱 Responsive Design

The app is fully responsive with carefully crafted breakpoints:

- 📱 Mobile: 320px - 480px
- 📱 Mobile Landscape: 481px - 767px
- 💻 Tablet: 768px - 1024px
- 🖥️ Desktop: 1025px+

## 🎯 Performance Optimizations

- ⚡ Lazy loading of images and components
- 🔄 Efficient data caching with React Query
- 📦 Code splitting by route
- 🖼️ WebP image format with fallbacks
- 🚀 Optimized asset delivery via CDN

## 🔐 Security Features

- 🔒 JWT with refresh tokens
- 🛡️ CSRF protection
- 🔐 Rate limiting
- 📝 Input sanitization
- 🔍 SQL injection prevention

## 📈 Analytics Integration

- 📊 Google Analytics 4
- 🎯 Custom event tracking
- 📱 User behavior analysis
- 🔍 SEO optimization
- 📈 Performance monitoring

## 🤝 Contributing

We ❤️ contributions! Please check our [Contributing Guidelines](CONTRIBUTING.md) before making a pull request.

<div align="center">

[![Contributors](https://contrib.rocks/image?repo=yourusername/nepal-real-estate-app)](https://github.com/yourusername/nepal-real-estate-app/graphs/contributors)

</div>

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Support

⭐️ Star this repo if you found it helpful!

## 📞 Contact

For any queries or suggestions:

- 📧 Email: your.email@example.com
- 💬 Discord: [Join our server](https://discord.gg/your-server)
- 🐦 Twitter: [@yourhandle](https://twitter.com/yourhandle)

---

<div align="center">

Made with ❤️ for Nepal's Real Estate Market

[⬆ Back to Top](#-nepal-real-estate-app)

</div>

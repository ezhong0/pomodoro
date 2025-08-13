# 🍅 Pomodoro Timer App

A beautiful, feature-rich Pomodoro timer built with React, Framer Motion, and modern web technologies. Perfect for boosting productivity with the proven Pomodoro Technique.

![Pomodoro Timer App](https://img.shields.io/badge/React-18.0.0-blue?style=for-the-badge&logo=react)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-10.0.0-purple?style=for-the-badge)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-green?style=for-the-badge&logo=pwa)
![Responsive](https://img.shields.io/badge/Responsive-Design-orange?style=for-the-badge&logo=responsive)

## ✨ Features

### 🎯 **Core Timer Functionality**
- **Focus Timer**: Customizable work sessions (1-180 minutes)
- **Short Breaks**: Quick rest periods (1-60 minutes)
- **Long Breaks**: Extended recovery time (1-120 minutes)
- **Auto-transition**: Seamlessly switch between work and break modes
- **Progress Tracking**: Visual circular progress indicator
- **Pomodoro Counter**: Track completed focus sessions

### 🎨 **Beautiful Design & Themes**
- **Multiple Themes**: Classic, Ocean, Forest, Sunset, and more
- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **Responsive Design**: Optimized for all screen sizes
- **Smooth Animations**: Powered by Framer Motion
- **Modern UI**: Clean, minimalist interface with glassmorphism effects

### 📱 **Mobile-First Experience**
- **PWA Support**: Install as a native app on your device
- **Touch Optimized**: Large, accessible touch targets
- **Responsive Layout**: Adapts perfectly to any screen size
- **Offline Capable**: Works without internet connection
- **Mobile Navigation**: Vertical icon sidebar for easy access

### 🔊 **Audio & Notifications**
- **Sound Effects**: Custom audio for timer completion
- **Volume Control**: Adjustable audio levels
- **Mute Option**: Silent mode for quiet environments
- **Visual Feedback**: Smooth animations and transitions

### ⚙️ **Advanced Settings**
- **Customizable Durations**: Set your preferred timer lengths
- **Auto-start**: Automatically begin next session
- **Session Management**: Configure pomodoros before long breaks
- **Progress Reset**: Clear completed sessions
- **Keyboard Shortcuts**: Spacebar to start/pause timer

## 🚀 Getting Started

### Prerequisites
- Node.js 16.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pomodoro-timer.git
   cd pomodoro-timer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 📱 PWA Installation

### Desktop Browser
1. Look for the install button in your browser's address bar
2. Click "Install" to add to your desktop
3. The app will work like a native application

### Mobile Device
1. **iOS**: Tap the Share button → "Add to Home Screen"
2. **Android**: Look for the install prompt or use "Add to Home Screen"
3. **Chrome**: Use the install button in the browser menu

## 🎮 How to Use

### Basic Timer Operation
1. **Select Mode**: Choose between Focus, Short Break, or Long Break
2. **Start Timer**: Click the Start button or press Spacebar
3. **Monitor Progress**: Watch the circular progress indicator
4. **Take Breaks**: Automatically transition to break mode
5. **Track Progress**: View completed pomodoros

### Customizing Your Experience
1. **Adjust Timers**: Click the timer display to edit durations
2. **Change Themes**: Use the theme selector in the header
3. **Toggle Dark Mode**: Switch between light and dark themes
4. **Volume Control**: Adjust audio levels as needed
5. **Settings Panel**: Configure advanced options

### Keyboard Shortcuts
- **Spacebar**: Start/Pause timer
- **Escape**: Cancel timer editing
- **Enter**: Confirm timer changes

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with Hooks
- **Animation Library**: Framer Motion
- **Build Tool**: Vite
- **Styling**: CSS3 with CSS Variables
- **Icons**: Custom SVG icons
- **Audio**: Web Audio API
- **PWA**: Service Workers and Web App Manifest

## 📱 Responsive Design

The app is designed to work perfectly on all devices:

- **Desktop**: Full-featured interface with horizontal layout
- **Tablet**: Optimized touch interface with balanced spacing
- **Mobile**: Compact vertical layout with icon-based navigation
- **Small Screens**: Ultra-compact design for very small devices

## 🎨 Theme System

### Available Themes
- **Classic**: Traditional Pomodoro colors
- **Ocean**: Calming blue tones
- **Forest**: Natural green palette
- **Sunset**: Warm orange and red hues
- **Midnight**: Deep dark theme
- **Coral**: Vibrant coral and teal

### Customization
- Switch between themes instantly
- Automatic dark/light mode detection
- Smooth theme transitions
- Persistent theme preferences

## 🔧 Configuration

### Timer Settings
- **Focus Time**: 1-180 minutes (default: 25)
- **Short Break**: 1-60 minutes (default: 5)
- **Long Break**: 1-120 minutes (default: 15)
- **Long Break After**: 1-12 pomodoros (default: 4)

### User Preferences
- **Auto-transition**: Automatically start next session
- **Sound**: Enable/disable audio notifications
- **Volume**: Adjust audio levels (0-100%)
- **Theme**: Choose your preferred color scheme

## 📊 Performance Features

- **Optimized Rendering**: Efficient React component updates
- **Smooth Animations**: 60fps animations with Framer Motion
- **Memory Management**: Proper cleanup of timers and event listeners
- **Lazy Loading**: Components load only when needed
- **PWA Caching**: Offline functionality with service workers

## 🧪 Testing

Run the test suite to ensure everything works correctly:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## 📦 Build & Deployment

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Production Deployment
1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your hosting service
3. Ensure HTTPS is enabled for PWA functionality

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure responsive design works on all screen sizes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Francesco Cirillo**: Creator of the Pomodoro Technique
- **React Team**: For the amazing framework
- **Framer Motion**: For smooth animations
- **Vite**: For fast build tooling
- **Open Source Community**: For inspiration and tools

## 📞 Support

If you have questions or need help:

- **Issues**: [GitHub Issues](https://github.com/yourusername/pomodoro-timer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/pomodoro-timer/discussions)
- **Email**: your.email@example.com

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/pomodoro-timer&type=Date)](https://star-history.com/#yourusername/pomodoro-timer&Date)

---

<div align="center">

**Made with ❤️ and ☕ by [Your Name]**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yourusername)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/yourusername)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/yourusername)

</div>

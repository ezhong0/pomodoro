import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import themePresets from './themes';
import './PomodoroStyles.css';

// Enhanced sound options
const sounds = {
  complete: 'https://assets.mixkit.co/active_storage/sfx/2317/2317-preview.mp3',
  tick: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3',
};

// Clean, minimalistic icons
const Icons = {
  sun: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  ),
  moon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  volume: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
    </svg>
  ),
  volumeMute: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <line x1="23" y1="9" x2="17" y2="15"/>
      <line x1="17" y1="9" x2="23" y2="15"/>
    </svg>
  ),
  play: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  pause: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="6" y="4" width="4" height="16"/>
      <rect x="14" y="4" width="4" height="16"/>
    </svg>
  ),
  reset: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
      <path d="M3 21v-5h5"/>
    </svg>
  ),
  focus: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  coffee: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
      <line x1="6" y1="1" x2="6" y2="4"/>
      <line x1="10" y1="1" x2="10" y2="4"/>
      <line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
  ),
  palm: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
  ),
  check: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  ),
  plus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  minus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
};

function App() {
  // Core timer state
  const [mode, setMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  
  // UI state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('theme') || 'classic');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [isEditingTimer, setIsEditingTimer] = useState(false);
  const [editTimerValue, setEditTimerValue] = useState('');
  const [muted, setMuted] = useState(() => localStorage.getItem('muted') === 'true');
  const [autoTransition, setAutoTransition] = useState(() => localStorage.getItem('autoTransition') !== 'false');
  const [showVolumePopover, setShowVolumePopover] = useState(false);
  const [isThemeTransitioning, setIsThemeTransitioning] = useState(false);
  
  // Timer settings
  const [workMinutes, setWorkMinutes] = useState(() => parseInt(localStorage.getItem('workMinutes')) || 25);
  const [breakMinutes, setBreakMinutes] = useState(() => parseInt(localStorage.getItem('breakMinutes')) || 5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(() => parseInt(localStorage.getItem('longBreakMinutes')) || 15);
  const [pomodorosBeforeLongBreak, setPomodorosBeforeLongBreak] = useState(() => parseInt(localStorage.getItem('pomodorosBeforeLongBreak')) || 4);
  const [volume, setVolume] = useState(() => parseFloat(localStorage.getItem('volume')) || 1);

  // Animation values
  const timerScale = useMotionValue(1);
  const timerRotation = useMotionValue(0);
  const progressScale = useSpring(1, { stiffness: 100, damping: 10 });
  
  // Refs
  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  const timerInputRef = useRef(null);
  const volumeButtonRef = useRef(null);
  const volumePopoverRef = useRef(null);

  const theme = themePresets[currentTheme][darkMode ? 'dark' : 'light'];

  // Smooth theme transition
  const handleThemeChange = (newTheme) => {
    setIsThemeTransitioning(true);
    setCurrentTheme(newTheme);
    setShowThemeSelector(false);
    
    setTimeout(() => {
      setIsThemeTransitioning(false);
    }, 300);
  };

  // Smooth dark mode transition
  const handleDarkModeToggle = () => {
    setIsThemeTransitioning(true);
    setDarkMode((d) => !d);
    
    setTimeout(() => {
      setIsThemeTransitioning(false);
    }, 300);
  };

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    localStorage.setItem('theme', currentTheme);
    localStorage.setItem('workMinutes', workMinutes);
    localStorage.setItem('breakMinutes', breakMinutes);
    localStorage.setItem('longBreakMinutes', longBreakMinutes);
    localStorage.setItem('pomodorosBeforeLongBreak', pomodorosBeforeLongBreak);
    localStorage.setItem('pomodoroCount', pomodoroCount);
    localStorage.setItem('autoTransition', autoTransition);
    localStorage.setItem('muted', muted);
    localStorage.setItem('volume', volume);
  }, [darkMode, currentTheme, workMinutes, breakMinutes, longBreakMinutes, pomodorosBeforeLongBreak, pomodoroCount, autoTransition, muted, volume]);

  // Update timer when mode changes
  useEffect(() => {
    const durations = { work: workMinutes, break: breakMinutes, longBreak: longBreakMinutes };
    setTimeLeft(durations[mode] * 60);
  }, [mode, workMinutes, breakMinutes, longBreakMinutes]);

  // Timer functionality
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            if (!muted) {
              audioRef.current.play();
            }
            
            // Success animation
            progressScale.set(1.1);
            setTimeout(() => progressScale.set(1), 200);
            
            if (mode === 'work') {
              const nextCount = pomodoroCount + 1;
              setPomodoroCount(nextCount);
              const nextMode = nextCount % pomodorosBeforeLongBreak === 0 ? 'longBreak' : 'break';
              setMode(nextMode);
              if (autoTransition) {
                setTimeout(() => setIsRunning(true), 1500);
              } else {
                setIsRunning(false);
              }
            } else {
              setMode('work');
              if (autoTransition) {
                setTimeout(() => setIsRunning(true), 1500);
              } else {
                setIsRunning(false);
              }
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode, pomodoroCount, pomodorosBeforeLongBreak, autoTransition, muted, progressScale]);

  // Timer edit functionality
  const handleTimerEditComplete = () => {
    if (editTimerValue) {
      const [minutes, seconds] = editTimerValue.split(':').map(num => parseInt(num, 10));
      if (!isNaN(minutes) && !isNaN(seconds)) {
        const newTimeInSeconds = (minutes * 60) + seconds;
        const currentModeDuration = {
          work: workMinutes,
          break: breakMinutes,
          longBreak: longBreakMinutes
        };
        
        const currentModeSeconds = currentModeDuration[mode] * 60;
        if (Math.abs(newTimeInSeconds - currentModeSeconds) > 30) {
          if (mode === 'work') setWorkMinutes(Math.round(newTimeInSeconds / 60));
          else if (mode === 'break') setBreakMinutes(Math.round(newTimeInSeconds / 60));
          else if (mode === 'longBreak') setLongBreakMinutes(Math.round(newTimeInSeconds / 60));
        }
        setTimeLeft(newTimeInSeconds);
      }
    }
    setIsEditingTimer(false);
  };

  // Handle clicks outside timer edit
  useEffect(() => {
    if (isEditingTimer) {
      const handleClickOutside = (event) => {
        if (timerInputRef.current && !timerInputRef.current.contains(event.target)) {
          handleTimerEditComplete();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isEditingTimer, editTimerValue]);

  // Handle clicks outside volume popover
  useEffect(() => {
    if (showVolumePopover) {
      const handleClickOutside = (event) => {
        if (
          volumePopoverRef.current &&
          !volumePopoverRef.current.contains(event.target) &&
          volumeButtonRef.current &&
          !volumeButtonRef.current.contains(event.target)
        ) {
          setShowVolumePopover(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showVolumePopover]);

  // Sync volume state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    setMuted(volume === 0);
  }, [volume]);

  // Spacebar hotkey
  useEffect(() => {
    const handleSpace = (e) => {
      if (e.code === 'Space' && !isEditingTimer && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        handleStartPause();
      }
    };
    window.addEventListener('keydown', handleSpace);
    return () => window.removeEventListener('keydown', handleSpace);
  }, [isEditingTimer]);

  // Utility functions
  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  
  const handleTimerClick = () => {
    if (!isRunning) {
      setEditTimerValue('');
      setIsEditingTimer(true);
      setTimeout(() => timerInputRef.current?.focus(), 50);
    }
  };

  const handleTimerInputChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(-4);
    value = value.padStart(4, '0');
    const minutes = value.slice(0, 2);
    const seconds = value.slice(2);
    setEditTimerValue(`${minutes}:${seconds}`);
  };

  const handleTimerKeyPress = (e) => {
    if (e.key === 'Enter') handleTimerEditComplete();
    else if (e.key === 'Escape') setIsEditingTimer(false);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    
    // Mode change animation
    timerScale.set(0.95);
    setTimeout(() => timerScale.set(1), 150);
  };

  const handleReset = () => {
    setIsRunning(false);
    const durations = { work: workMinutes, break: breakMinutes, longBreak: longBreakMinutes };
    setTimeLeft(durations[mode] * 60);
    
    // Reset animation
    timerRotation.set(timerRotation.get() + 360);
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
    
    // Start/pause animation
    if (!isRunning) {
      timerScale.set(1.05);
      setTimeout(() => timerScale.set(1), 200);
    }
  };

  // Timer circle calculations
  const radius = 280;
  const circumference = 2 * Math.PI * radius;
  const totalDuration = mode === 'work' ? workMinutes * 60 : mode === 'break' ? breakMinutes * 60 : longBreakMinutes * 60;
  const progress = timeLeft / totalDuration;
  const strokeDashoffset = circumference * (1 - progress);

  const backgroundColor = mode === 'work' ? theme.backgroundWork : mode === 'break' ? theme.backgroundBreak : theme.backgroundLongBreak;
  const strokeColor = mode === 'work' ? theme.work : mode === 'break' ? theme.break : theme.longBreak;

  // Dynamic styles
  const dynamicStyles = {
    appContainer: { 
      backgroundColor, 
      color: theme.text,
      transition: isThemeTransitioning ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
    },
    headerButton: {
      background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      color: theme.text,
      backdropFilter: 'blur(20px)',
      border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
    },
    themePanel: {
      backgroundColor: darkMode ? 'rgba(20, 25, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      color: theme.text,
      backdropFilter: 'blur(20px)',
      border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
    },
    settingsPanel: {
      backgroundColor: theme.settingsBg,
      color: theme.text,
      backdropFilter: 'blur(20px)',
      border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
    },
    modeButtonActive: {
      backgroundColor: strokeColor,
      borderColor: strokeColor,
      color: darkMode ? '#ECF0F1' : '#FFFFFF',
      boxShadow: `0 8px 32px ${strokeColor}40`,
    },
    modeButtonInactive: {
      backgroundColor: 'transparent',
      borderColor: strokeColor,
      color: theme.text,
      opacity: 0.7,
    },
    actionButton: {
      backgroundColor: strokeColor,
      color: darkMode ? '#ECF0F1' : '#FFFFFF',
      boxShadow: `0 8px 32px ${strokeColor}40`,
    },
    resetButton: {
      border: `2px solid ${strokeColor}`,
      color: theme.text,
      backgroundColor: 'transparent',
    },
  };

  return (
    <motion.div 
      className="app-container" 
      style={dynamicStyles.appContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <audio ref={audioRef} src={sounds.complete} />

      {/* Header */}
      <motion.header 
        className="app-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="header-left">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDarkModeToggle}
            className="header-button"
            style={dynamicStyles.headerButton}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? Icons.sun : Icons.moon}
            <span className="button-text">{darkMode ? 'Light' : 'Dark'}</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowThemeSelector(!showThemeSelector)}
            className="header-button"
            style={{
              ...dynamicStyles.headerButton,
              background: showThemeSelector ? 
                (darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)') : 
                dynamicStyles.headerButton.background,
            }}
            aria-label="Change theme"
          >
            <span className="theme-indicator" style={{ background: theme.work }} />
            <span className="button-text">{themePresets[currentTheme].name}</span>
          </motion.button>
          
          <div className="volume-control">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              ref={volumeButtonRef}
              className="header-button volume-button"
              style={dynamicStyles.headerButton}
              onClick={() => setShowVolumePopover((v) => !v)}
              aria-label="Volume control"
            >
              {volume === 0 ? Icons.volumeMute : Icons.volume}
            </motion.button>
            
            <AnimatePresence>
              {showVolumePopover && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 30 }}
                  ref={volumePopoverRef}
                  className="volume-popover"
                  style={{
                    background: darkMode ? 'rgba(20, 25, 35, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                    border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={e => setVolume(parseFloat(e.target.value))}
                    className="volume-slider"
                    style={{ 
                      '--volume-fill': strokeColor,
                      '--volume-pct': `${volume * 100}%`
                    }}
                    aria-label="Volume"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSettingsOpen(!settingsOpen)}
          className="header-button settings-button"
          style={{
            ...dynamicStyles.headerButton,
            background: settingsOpen ? 
              (darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)') : 
              dynamicStyles.headerButton.background,
          }}
          aria-label="Open settings"
        >
          {Icons.settings}
          <span className="button-text">Settings</span>
        </motion.button>
      </motion.header>

      {/* Theme Selector */}
      <AnimatePresence>
        {showThemeSelector && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            className="theme-panel"
            style={dynamicStyles.themePanel}
          >
            <h3 className="panel-title">Choose Theme</h3>
            <div className="theme-grid">
              {Object.keys(themePresets).map((themeName) => (
                <motion.button
                  key={themeName}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleThemeChange(themeName)}
                  className={`theme-option ${currentTheme === themeName ? 'active' : ''}`}
                  style={{
                    background: currentTheme === themeName ? 
                      (darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)') : 
                      'transparent',
                  }}
                  aria-label={`Select ${themePresets[themeName].name} theme`}
                >
                  <div className="theme-preview" style={{ 
                    background: `linear-gradient(135deg, ${themePresets[themeName][darkMode ? 'dark' : 'light'].work}, ${themePresets[themeName][darkMode ? 'dark' : 'light'].break})`,
                  }} />
                  <span>{themePresets[themeName].name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            className="settings-panel"
            style={dynamicStyles.settingsPanel}
          >
            <h3 className="panel-title">Timer Settings</h3>
            
            <div className="setting-group">
              <label className="setting-label">Auto Start</label>
              <div className="toggle-container">
                <input
                  type="checkbox"
                  checked={autoTransition}
                  onChange={() => setAutoTransition(!autoTransition)}
                  className="toggle-input"
                  aria-label="Auto start timer"
                />
                <span className={`toggle-slider ${autoTransition ? 'active' : ''}`} style={{ '--toggle-color': strokeColor }} />
              </div>
            </div>
            
            <div className="setting-group">
              <label className="setting-label">Focus Time</label>
              <div className="number-input">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setWorkMinutes(prev => Math.max(1, prev - 1))}
                  aria-label="Decrease focus time"
                >
                  {Icons.minus}
                </motion.button>
                <input
                  type="number"
                  value={workMinutes}
                  onChange={(e) => setWorkMinutes(Math.max(1, Math.min(180, parseInt(e.target.value) || 1)))}
                  min="1"
                  max="180"
                  aria-label="Focus time in minutes"
                />
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setWorkMinutes(prev => Math.min(180, prev + 1))}
                  aria-label="Increase focus time"
                >
                  {Icons.plus}
                </motion.button>
              </div>
              <span className="setting-unit">min</span>
            </div>
            
            <div className="setting-group">
              <label className="setting-label">Short Break</label>
              <div className="number-input">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setBreakMinutes(prev => Math.max(1, prev - 1))}
                  aria-label="Decrease short break time"
                >
                  {Icons.minus}
                </motion.button>
                <input
                  type="number"
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(Math.max(1, Math.min(60, parseInt(e.target.value) || 1)))}
                  min="1"
                  max="60"
                  aria-label="Short break time in minutes"
                />
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setBreakMinutes(prev => Math.min(60, prev + 1))}
                  aria-label="Increase short break time"
                >
                  {Icons.plus}
                </motion.button>
              </div>
              <span className="setting-unit">min</span>
            </div>
            
            <div className="setting-group">
              <label className="setting-label">Long Break</label>
              <div className="number-input">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setLongBreakMinutes(prev => Math.max(1, prev - 1))}
                  aria-label="Decrease long break time"
                >
                  {Icons.minus}
                </motion.button>
                <input
                  type="number"
                  value={longBreakMinutes}
                  onChange={(e) => setLongBreakMinutes(Math.max(1, Math.min(120, parseInt(e.target.value) || 1)))}
                  min="1"
                  max="120"
                  aria-label="Long break time in minutes"
                />
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setLongBreakMinutes(prev => Math.min(120, prev + 1))}
                  aria-label="Increase long break time"
                >
                  {Icons.plus}
                </motion.button>
              </div>
              <span className="setting-unit">min</span>
            </div>
            
            <div className="setting-group">
              <label className="setting-label">Long Break After</label>
              <div className="number-input">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPomodorosBeforeLongBreak(prev => Math.max(1, prev - 1))}
                  aria-label="Decrease pomodoros before long break"
                >
                  {Icons.minus}
                </motion.button>
                <input
                  type="number"
                  value={pomodorosBeforeLongBreak}
                  onChange={(e) => setPomodorosBeforeLongBreak(Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))}
                  min="1"
                  max="12"
                  aria-label="Pomodoros before long break"
                />
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPomodorosBeforeLongBreak(prev => Math.min(12, prev + 1))}
                  aria-label="Increase pomodoros before long break"
                >
                  {Icons.plus}
                </motion.button>
              </div>
              <span className="setting-unit">pomodoros</span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPomodoroCount(0)}
              className="reset-pomodoros-btn"
              style={dynamicStyles.actionButton}
              aria-label="Reset pomodoro count"
            >
              {Icons.check}
              <span>Reset Progress</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode Selector */}
      <motion.div 
        className="mode-selector"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {[
          { key: 'work', label: 'Focus', icon: Icons.focus },
          { key: 'break', label: 'Short Break', icon: Icons.coffee },
          { key: 'longBreak', label: 'Long Break', icon: Icons.palm }
        ].map(({ key, label, icon }) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleModeChange(key)}
            className="mode-button"
            style={mode === key ? dynamicStyles.modeButtonActive : dynamicStyles.modeButtonInactive}
            aria-label={`Switch to ${label.toLowerCase()} mode`}
          >
            <span className="mode-icon">{icon}</span>
            {label}
          </motion.button>
        ))}
      </motion.div>

      {/* Timer Display */}
      <motion.div 
        className="timer-container"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6, type: "spring", stiffness: 100, damping: 15 }}
      >
        <motion.div 
          className="timer-circle"
          style={{ scale: timerScale }}
          animate={{ rotate: timerRotation }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <svg width="600" height="600" viewBox="0 0 800 800" className="timer-svg">
            <circle
              cx="400"
              cy="400"
              r={radius}
              fill="none"
              stroke={darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}
              strokeWidth="8"
            />
            <motion.circle
              cx="400"
              cy="400"
              r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ scale: progressScale }}
            />
          </svg>
          
          <div className="timer-content">
            {isEditingTimer ? (
              <div ref={timerInputRef} className="timer-edit">
                <input
                  className="timer-input"
                  value={editTimerValue || formatTime(timeLeft)}
                  onChange={handleTimerInputChange}
                  onKeyDown={handleTimerKeyPress}
                  onBlur={handleTimerEditComplete}
                  autoFocus
                  placeholder={formatTime(timeLeft)}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  style={{ color: theme.text, borderBottomColor: strokeColor }}
                  aria-label="Edit timer"
                />
              </div>
            ) : (
              <motion.h1 
                className="timer-display"
                onClick={handleTimerClick}
                style={{ cursor: isRunning ? 'default' : 'pointer' }}
                whileHover={!isRunning ? { scale: 1.02, y: -2 } : {}}
                whileTap={!isRunning ? { scale: 0.98 } : {}}
                aria-label={isRunning ? 'Timer running' : 'Click to edit timer'}
              >
                {formatTime(timeLeft)}
              </motion.h1>
            )}
            
            <motion.h2 
              className="timer-mode-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {mode === 'work' ? 'Focus Time' : mode === 'break' ? 'Short Break' : 'Long Break'}
            </motion.h2>
            
            <motion.p 
              className="pomodoro-counter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Completed: {pomodoroCount} pomodoros
            </motion.p>
          </div>
        </motion.div>
      </motion.div>

      {/* Control Buttons */}
      <motion.div 
        className="controls"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <motion.button
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStartPause}
          className="control-button start-button"
          style={dynamicStyles.actionButton}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        >
          {isRunning ? Icons.pause : Icons.play}
          <span>{isRunning ? 'Pause' : 'Start'}</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="control-button reset-button"
          style={dynamicStyles.resetButton}
          aria-label="Reset timer"
        >
          {Icons.reset}
          <span>Reset</span>
        </motion.button>
      </motion.div>

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {pomodoroCount > 0 && (
          <motion.div
            className="success-overlay"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
          >
            <motion.div
              className="success-icon"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              {Icons.check}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default App;
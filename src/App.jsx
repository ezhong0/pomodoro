import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import themePresets from './themes';
import './PomodoroStyles.css';

// Enhanced sound options
const sounds = {
  complete: 'https://assets.mixkit.co/active_storage/sfx/2317/2317-preview.mp3',
  tick: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3',
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
  
  // Timer settings
  const [workMinutes, setWorkMinutes] = useState(() => parseInt(localStorage.getItem('workMinutes')) || 25);
  const [breakMinutes, setBreakMinutes] = useState(() => parseInt(localStorage.getItem('breakMinutes')) || 5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(() => parseInt(localStorage.getItem('longBreakMinutes')) || 15);
  const [pomodorosBeforeLongBreak, setPomodorosBeforeLongBreak] = useState(() => parseInt(localStorage.getItem('pomodorosBeforeLongBreak')) || 4);
  const [volume, setVolume] = useState(() => parseFloat(localStorage.getItem('volume')) || 1);

  // Refs
  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  const timerInputRef = useRef(null);
  const volumeButtonRef = useRef(null);
  const volumePopoverRef = useRef(null);

  const theme = themePresets[currentTheme][darkMode ? 'dark' : 'light'];

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
  }, [isRunning, mode, pomodoroCount, pomodorosBeforeLongBreak, autoTransition, muted]);

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
  };

  const handleReset = () => {
    setIsRunning(false);
    const durations = { work: workMinutes, break: breakMinutes, longBreak: longBreakMinutes };
    setTimeLeft(durations[mode] * 60);
  };

  const handleStartPause = () => setIsRunning(!isRunning);

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
    appContainer: { backgroundColor, color: theme.text },
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
    <div className="app-container" style={dynamicStyles.appContainer}>
      <audio ref={audioRef} src={sounds.complete} />

      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode((d) => !d)}
            className="header-button"
            style={dynamicStyles.headerButton}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowThemeSelector(!showThemeSelector)}
            className="header-button"
            style={{
              ...dynamicStyles.headerButton,
              background: showThemeSelector ? 
                (darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)') : 
                dynamicStyles.headerButton.background,
            }}
          >
            <span className="theme-indicator" style={{ background: theme.work }} />
            {themePresets[currentTheme].name}
          </motion.button>
          
          <div className="volume-control">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              ref={volumeButtonRef}
              className="header-button volume-button"
              style={dynamicStyles.headerButton}
              onClick={() => setShowVolumePopover((v) => !v)}
            >
              {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
            </motion.button>
            
            <AnimatePresence>
              {showVolumePopover && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
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
                    style={{ '--volume-fill': strokeColor }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSettingsOpen(!settingsOpen)}
          className="header-button settings-button"
          style={{
            ...dynamicStyles.headerButton,
            background: settingsOpen ? 
              (darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)') : 
              dynamicStyles.headerButton.background,
          }}
        >
          ⚙️ Settings
        </motion.button>
      </header>

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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setCurrentTheme(themeName);
                    setShowThemeSelector(false);
                  }}
                  className={`theme-option ${currentTheme === themeName ? 'active' : ''}`}
                  style={{
                    background: currentTheme === themeName ? 
                      (darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)') : 
                      'transparent',
                  }}
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
                />
                <span className={`toggle-slider ${autoTransition ? 'active' : ''}`} style={{ '--toggle-color': strokeColor }} />
              </div>
            </div>
            
            <div className="setting-group">
              <label className="setting-label">Focus Time</label>
              <div className="number-input">
                <button onClick={() => setWorkMinutes(prev => Math.max(1, prev - 1))}>−</button>
                <input
                  type="number"
                  value={workMinutes}
                  onChange={(e) => setWorkMinutes(Math.max(1, Math.min(180, parseInt(e.target.value) || 1)))}
                  min="1"
                  max="180"
                />
                <button onClick={() => setWorkMinutes(prev => Math.min(180, prev + 1))}>+</button>
              </div>
              <span className="setting-unit">min</span>
            </div>
            
            <div className="setting-group">
              <label className="setting-label">Short Break</label>
              <div className="number-input">
                <button onClick={() => setBreakMinutes(prev => Math.max(1, prev - 1))}>−</button>
                <input
                  type="number"
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(Math.max(1, Math.min(60, parseInt(e.target.value) || 1)))}
                  min="1"
                  max="60"
                />
                <button onClick={() => setBreakMinutes(prev => Math.min(60, prev + 1))}>+</button>
              </div>
              <span className="setting-unit">min</span>
            </div>
            
            <div className="setting-group">
              <label className="setting-label">Long Break</label>
              <div className="number-input">
                <button onClick={() => setLongBreakMinutes(prev => Math.max(1, prev - 1))}>−</button>
                <input
                  type="number"
                  value={longBreakMinutes}
                  onChange={(e) => setLongBreakMinutes(Math.max(1, Math.min(120, parseInt(e.target.value) || 1)))}
                  min="1"
                  max="120"
                />
                <button onClick={() => setLongBreakMinutes(prev => Math.min(120, prev + 1))}>+</button>
              </div>
              <span className="setting-unit">min</span>
            </div>
            
            <div className="setting-group">
              <label className="setting-label">Long Break After</label>
              <div className="number-input">
                <button onClick={() => setPomodorosBeforeLongBreak(prev => Math.max(1, prev - 1))}>−</button>
                <input
                  type="number"
                  value={pomodorosBeforeLongBreak}
                  onChange={(e) => setPomodorosBeforeLongBreak(Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))}
                  min="1"
                  max="12"
                />
                <button onClick={() => setPomodorosBeforeLongBreak(prev => Math.min(12, prev + 1))}>+</button>
              </div>
              <span className="setting-unit">pomodoros</span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPomodoroCount(0)}
              className="reset-pomodoros-btn"
              style={dynamicStyles.actionButton}
            >
              Reset Progress
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode Selector */}
      <div className="mode-selector">
        {[
          { key: 'work', label: 'Focus', icon: '🎯' },
          { key: 'break', label: 'Short Break', icon: '☕' },
          { key: 'longBreak', label: 'Long Break', icon: '🌴' }
        ].map(({ key, label, icon }) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleModeChange(key)}
            className="mode-button"
            style={mode === key ? dynamicStyles.modeButtonActive : dynamicStyles.modeButtonInactive}
          >
            <span className="mode-icon">{icon}</span>
            {label}
          </motion.button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="timer-container">
        <div className="timer-circle">
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
                />
              </div>
            ) : (
              <motion.h1 
                className="timer-display"
                onClick={handleTimerClick}
                style={{ cursor: isRunning ? 'default' : 'pointer' }}
                whileHover={!isRunning ? { scale: 1.02 } : {}}
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
        </div>
      </div>

      {/* Control Buttons */}
      <div className="controls">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStartPause}
          className="control-button start-button"
          style={dynamicStyles.actionButton}
        >
          {isRunning ? '⏸️ Pause' : '▶️ Start'}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="control-button reset-button"
          style={dynamicStyles.resetButton}
        >
          🔄 Reset
        </motion.button>
      </div>
    </div>
  );
}

export default App;
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import themePresets from './themes';
import './PomodoroStyles.css';

// Cute, softer sound options
const cuteSounds = {
  complete: 'https://assets.mixkit.co/active_storage/sfx/2317/2317-preview.mp3', // Uplifting flute notification
  tick: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3', // Soft tick sound (optional)
};

function App() {
  const [mode, setMode] = useState('work');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('theme') || 'classic');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [isEditingTimer, setIsEditingTimer] = useState(false);
  const [editTimerValue, setEditTimerValue] = useState('');
  const [muted, setMuted] = useState(() => {
    const saved = localStorage.getItem('muted');
    return saved !== null ? saved === 'true' : false;
  });
  const [autoTransition, setAutoTransition] = useState(() => {
    const saved = localStorage.getItem('autoTransition');
    return saved !== null ? saved === 'true' : true;
  });

  const [workMinutes, setWorkMinutes] = useState(() => {
    const saved = localStorage.getItem('workMinutes');
    return saved ? parseInt(saved, 10) : 25;
  });
  const [breakMinutes, setBreakMinutes] = useState(() => {
    const saved = localStorage.getItem('breakMinutes');
    return saved ? parseInt(saved, 10) : 5;
  });
  const [longBreakMinutes, setLongBreakMinutes] = useState(() => {
    const saved = localStorage.getItem('longBreakMinutes');
    return saved ? parseInt(saved, 10) : 15;
  });
  const [pomodorosBeforeLongBreak, setPomodorosBeforeLongBreak] = useState(() => {
    const saved = localStorage.getItem('pomodorosBeforeLongBreak');
    return saved ? parseInt(saved, 10) : 4;
  });

  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(() => {
    const saved = localStorage.getItem('pomodoroCount');
    return saved ? parseInt(saved, 10) : 0;
  });

  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  const breathingAnimationRef = useRef(null);
  const timerInputRef = useRef(null);
  const [showVolumePopover, setShowVolumePopover] = useState(false);
  const volumeButtonRef = useRef(null);
  const volumePopoverRef = useRef(null);

  const theme = themePresets[currentTheme][darkMode ? 'dark' : 'light'];

  // Add a volume state for a single source of truth
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('volume');
    return saved !== null ? parseFloat(saved) : 1;
  });

  // Save settings to localStorage when they change
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
  }, [darkMode, currentTheme, workMinutes, breakMinutes, longBreakMinutes, pomodorosBeforeLongBreak, pomodoroCount, autoTransition, muted]);

  // Update timer when mode changes
  useEffect(() => {
    const durations = {
      work: workMinutes,
      break: breakMinutes,
      longBreak: longBreakMinutes,
    };
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
              // Start next mode automatically if autoTransition is enabled
              if (autoTransition) {
                // Add a small delay before starting new timer
                setTimeout(() => setIsRunning(true), 1500);
              } else {
                setIsRunning(false);
              }
            } else {
              setMode('work');
              // Start next mode automatically if autoTransition is enabled
              if (autoTransition) {
                // Add a small delay before starting new timer
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

  // Handle timer edit completion
  const handleTimerEditComplete = () => {
    if (editTimerValue) {
      const [minutes, seconds] = editTimerValue.split(':').map(num => parseInt(num, 10));
      
      if (!isNaN(minutes) && !isNaN(seconds)) {
        const newTimeInSeconds = (minutes * 60) + seconds;
        
        // Update the current mode's minutes if it's significantly different
        const currentModeDuration = {
          work: workMinutes,
          break: breakMinutes,
          longBreak: longBreakMinutes
        };
        
        // Only update the mode setting if the change is significant (more than 30 seconds difference)
        const currentModeSeconds = currentModeDuration[mode] * 60;
        if (Math.abs(newTimeInSeconds - currentModeSeconds) > 30) {
          if (mode === 'work') {
            setWorkMinutes(Math.round(newTimeInSeconds / 60));
          } else if (mode === 'break') {
            setBreakMinutes(Math.round(newTimeInSeconds / 60));
          } else if (mode === 'longBreak') {
            setLongBreakMinutes(Math.round(newTimeInSeconds / 60));
          }
        }
        
        // Always update the timer
        setTimeLeft(newTimeInSeconds);
      }
    }
    
    setIsEditingTimer(false);
  };

  // Handle clicks outside of timer edit
  useEffect(() => {
    if (isEditingTimer) {
      const handleClickOutside = (event) => {
        if (timerInputRef.current && !timerInputRef.current.contains(event.target)) {
          handleTimerEditComplete();
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isEditingTimer, editTimerValue]);

  // Format time as MM:SS
  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // Handle timer click to edit
  const handleTimerClick = () => {
    if (!isRunning) {
      setEditTimerValue('');
      setIsEditingTimer(true);
      setTimeout(() => {
        if (timerInputRef.current) {
          timerInputRef.current.focus();
        }
      }, 50);
    }
  };

  // Handle timer edit input change
  const handleTimerInputChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Only digits
    // Limit to 4 digits (MMSS)
    if (value.length > 4) value = value.slice(-4);
    // Pad left with zeros for formatting
    value = value.padStart(4, '0');
    // Format as MM:SS
    const minutes = value.slice(0, 2);
    const seconds = value.slice(2);
    setEditTimerValue(`${minutes}:${seconds}`);
  };

  // Handle key press in timer edit
  const handleTimerKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleTimerEditComplete();
    } else if (e.key === 'Escape') {
      setIsEditingTimer(false);
    }
  };

  // Handle mode change
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
  };

  // Timer circle dimensions
  const radius = 280;
  const circumference = 2 * Math.PI * radius;
  const totalDuration =
    mode === 'work' ? workMinutes * 60 : mode === 'break' ? breakMinutes * 60 : longBreakMinutes * 60;
  const progress = timeLeft / totalDuration;
  const strokeDashoffset = circumference * (1-progress); // Changed to make it fill clockwise

  const backgroundColor =
    mode === 'work'
      ? theme.backgroundWork
      : mode === 'break'
      ? theme.backgroundBreak
      : theme.backgroundLongBreak;
  const strokeColor =
    mode === 'work' ? theme.work : mode === 'break' ? theme.break : theme.longBreak;

  // Handle reset
  const handleReset = () => {
    setIsRunning(false);
    const durations = {
      work: workMinutes,
      break: breakMinutes,
      longBreak: longBreakMinutes,
    };
    setTimeLeft(durations[mode] * 60);
  };

  // Handle start/pause
  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  // Handle clicks outside the volume popover
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

  // Sync volume state with audio element and localStorage
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    setMuted(volume === 0);
    localStorage.setItem('volume', volume);
  }, [volume]);

  // Add spacebar start/pause hotkey
  useEffect(() => {
    const handleSpace = (e) => {
      // Only trigger if not editing timer and not in an input
      if (e.code === 'Space' && !isEditingTimer && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        handleStartPause();
      }
    };
    window.addEventListener('keydown', handleSpace);
    return () => window.removeEventListener('keydown', handleSpace);
  }, [isEditingTimer, handleStartPause]);

  // Dynamic styles based on theme
  const dynamicStyles = {
    appContainer: {
      backgroundColor,
      color: theme.text,
    },
    darkModeButton: {
      background: darkMode ? 'rgba(60, 60, 70, 0.5)' : 'rgba(230, 230, 240, 0.7)',
      color: theme.text
    },
    themeButton: {
      background: showThemeSelector ? 
        (darkMode ? 'rgba(100, 100, 100, 0.5)' : 'rgba(220, 220, 220, 0.7)') : 
        (darkMode ? 'rgba(60, 60, 70, 0.5)' : 'rgba(230, 230, 240, 0.7)'),
      color: theme.text
    },
    settingsButton: {
      background: settingsOpen ? 
        (darkMode ? 'rgba(100, 100, 100, 0.5)' : 'rgba(220, 220, 220, 0.7)') : 
        'transparent',
      color: theme.text
    },
    themePanel: {
      backgroundColor: darkMode ? 'rgba(40, 55, 71, 0.95)' : 'rgba(245, 245, 245, 0.95)',
      color: theme.text
    },
    settingsPanel: {
      backgroundColor: theme.settingsBg,
      color: theme.text,
      border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)'
    },
    settingInputGroup: {
      background: theme.inputBg
    },
    borderRight: {
      borderRight: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)'
    },
    borderLeft: {
      borderLeft: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)'
    },
    settingInput: {
      color: theme.text
    },
    closeButton: {
      backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
      color: theme.text
    },
    actionButton: {
      backgroundColor: strokeColor,
      color: darkMode ? '#ECF0F1' : '#FFFFFF'
    },
    resetButton: {
      border: `2px solid ${strokeColor}`,
      color: theme.text
    },
    modeButtonActive: {
      backgroundColor: strokeColor,
      borderColor: strokeColor,
      color: darkMode ? '#ECF0F1' : '#FFFFFF',
      opacity: 1
    },
    modeButtonInactive: {
      backgroundColor: 'transparent',
      borderColor: strokeColor,
      color: theme.text,
      opacity: 0.6
    },
    timerEditInput: {
      background: 'transparent',
      fontSize: '8rem',
      fontWeight: '300',
      fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
      letterSpacing: '-4px',
      color: theme.text,
      width: '100%',
      textAlign: 'center',
      border: 'none',
      outline: 'none',
      padding: '0',
      margin: '0',
      borderBottom: `2px dashed ${strokeColor}`
    },
    timerEditPlaceholder: {
      fontSize: '8rem',
      fontWeight: '300',
      fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
      letterSpacing: '-4px',
      color: `${theme.text}80`,
      opacity: 0.6
    }
  };

  return (
    <div className="app-container" style={dynamicStyles.appContainer}>
      {/* Audio element for alarm */}
      <audio ref={audioRef} src={cuteSounds.complete} />

      {/* Header left: dark mode, theme, volume (in a flex row, top left) */}
      <div className="header-left">
        <button
          onClick={() => setDarkMode((d) => !d)}
          className="header-button dark-mode-button"
          style={dynamicStyles.darkModeButton}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
        <button
          onClick={() => setShowThemeSelector(!showThemeSelector)}
          className="header-button theme-button"
          style={dynamicStyles.themeButton}
        >
          <span style={{
            display: 'inline-block',
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: themePresets[currentTheme][darkMode ? 'dark' : 'light'].work,
            marginRight: 8,
            verticalAlign: 'middle',
            border: darkMode ? '2px solid rgba(255,255,255,0.1)' : '2px solid rgba(0,0,0,0.1)'
          }} />
          Theme: {themePresets[currentTheme].name}
        </button>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <button
            ref={volumeButtonRef}
            className="header-button volume-button"
            style={dynamicStyles.darkModeButton}
            onClick={() => setShowVolumePopover((v) => !v)}
            aria-label="Volume"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" style={{ display: 'block' }}>
              {volume === 0 ? (
                <g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
                  <path d="M3 9v4h4l5 5V4l-5 5H3z" />
                  <line x1="17" y1="7" x2="7" y2="17" />
                </g>
              ) : (
                <g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
                  <path d="M3 9v4h4l5 5V4l-5 5H3z" />
                  <path d="M16 8c1.333 1.333 1.333 4.667 0 6" />
                </g>
              )}
            </svg>
          </button>
          {showVolumePopover && (
            <div
              ref={volumePopoverRef}
              className="volume-popover"
              style={{
                position: 'absolute',
                top: '110%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: darkMode ? 'rgba(40, 55, 71, 0.98)' : '#fff',
                border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #eee',
                borderRadius: 12,
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                padding: 16,
                zIndex: 1000,
                minWidth: 120,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
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
                style={{ width: 90, accentColor: strokeColor, '--volume-pct': `${volume * 100}%`, '--volume-fill': strokeColor }}
                aria-label="Volume"
              />
            </div>
          )}
        </div>
      </div>

      {/* Header right: settings button (top right) */}
      <button
        onClick={() => setSettingsOpen(!settingsOpen)}
        className="header-button settings-button"
        style={{ ...dynamicStyles.darkModeButton, position: 'absolute', right: 24, top: 24, zIndex: 100 }}
      >
        <span role="img" aria-label="settings">⚙️</span> Settings
      </button>

      {/* Theme selector panel */}
      <AnimatePresence>
        {showThemeSelector && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="theme-panel"
            style={dynamicStyles.themePanel}
          >
            <h3 className="theme-title">Select Theme</h3>
            <div className="theme-options">
              {Object.keys(themePresets).map((themeName) => (
                <button
                  key={themeName}
                  onClick={() => {
                    setCurrentTheme(themeName);
                    setShowThemeSelector(false);
                  }}
                  className="theme-option"
                  style={{
                    backgroundColor: currentTheme === themeName 
                      ? (darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.05)')
                      : 'transparent',
                    color: theme.text
                  }}
                >
                  <div className="theme-color-dot" style={{ 
                    background: themePresets[themeName][darkMode ? 'dark' : 'light'].work,
                    border: darkMode ? '2px solid rgba(255,255,255,0.1)' : '2px solid rgba(0,0,0,0.1)',
                  }} />
                  {themePresets[themeName].name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="settings-panel"
            style={dynamicStyles.settingsPanel}
          >
            <h3 className="settings-title">Pomodoro Settings</h3>
            
            {/* Auto Transition Toggle */}
            <div className="setting-row auto-transition-setting">
              <label className="setting-label">Auto Start</label>
              <label className="toggle-switch" style={{ '--toggle-on': strokeColor }}>
                <input
                  type="checkbox"
                  checked={autoTransition}
                  onChange={() => setAutoTransition(!autoTransition)}
                  style={{ display: 'none' }}
                />
                <span className={`toggle-slider${autoTransition ? ' active' : ''}`}></span>
              </label>
              <span className="setting-unit">{autoTransition ? 'On' : 'Off'}</span>
            </div>
            
            {/* Focus Duration */}
            <div className="setting-row">
              <label className="setting-label">Focus Time</label>
              <div className="setting-input-group" style={dynamicStyles.settingInputGroup}>
                <button
                  onClick={() => setWorkMinutes(prev => Math.max(1, prev - 1))}
                  className="setting-button"
                  style={{ ...dynamicStyles.settingInput, ...dynamicStyles.borderRight }}
                >
                  −
                </button>
                <input
                  type="text"
                  value={workMinutes}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setWorkMinutes(1);
                    } else {
                      const num = parseInt(value, 10);
                      if (!isNaN(num)) {
                        setWorkMinutes(Math.max(1, Math.min(180, num)));
                      }
                    }
                  }}
                  className="setting-input"
                  style={dynamicStyles.settingInput}
                />
                <button
                  onClick={() => setWorkMinutes(prev => Math.min(180, prev + 1))}
                  className="setting-button"
                  style={{ ...dynamicStyles.settingInput, ...dynamicStyles.borderLeft }}
                >
                  +
                </button>
              </div>
              <span className="setting-unit">minutes</span>
            </div>
            
            {/* Short Break Duration */}
            <div className="setting-row">
              <label className="setting-label">Short Break</label>
              <div className="setting-input-group" style={dynamicStyles.settingInputGroup}>
                <button
                  onClick={() => setBreakMinutes(prev => Math.max(1, prev - 1))}
                  className="setting-button"
                  style={{ ...dynamicStyles.settingInput, ...dynamicStyles.borderRight }}
                >
                  −
                </button>
                <input
                  type="text"
                  value={breakMinutes}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setBreakMinutes(1);
                    } else {
                      const num = parseInt(value, 10);
                      if (!isNaN(num)) {
                        setBreakMinutes(Math.max(1, Math.min(60, num)));
                      }
                    }
                  }}
                  className="setting-input"
                  style={dynamicStyles.settingInput}
                />
                <button
                  onClick={() => setBreakMinutes(prev => Math.min(60, prev + 1))}
                  className="setting-button"
                  style={{ ...dynamicStyles.settingInput, ...dynamicStyles.borderLeft }}
                >
                  +
                </button>
              </div>
              <span className="setting-unit">minutes</span>
            </div>
            
            {/* Long Break Duration */}
            <div className="setting-row">
              <label className="setting-label">Long Break</label>
              <div className="setting-input-group" style={dynamicStyles.settingInputGroup}>
                <button
                  onClick={() => setLongBreakMinutes(prev => Math.max(1, prev - 1))}
                  className="setting-button"
                  style={{ ...dynamicStyles.settingInput, ...dynamicStyles.borderRight }}
                >
                  −
                </button>
                <input
                  type="text"
                  value={longBreakMinutes}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setLongBreakMinutes(1);
                    } else {
                      const num = parseInt(value, 10);
                      if (!isNaN(num)) {
                        setLongBreakMinutes(Math.max(1, Math.min(120, num)));
                      }
                    }
                  }}
                  className="setting-input"
                  style={dynamicStyles.settingInput}
                />
                <button
                  onClick={() => setLongBreakMinutes(prev => Math.min(120, prev + 1))}
                  className="setting-button"
                  style={{ ...dynamicStyles.settingInput, ...dynamicStyles.borderLeft }}
                >
                  +
                </button>
              </div>
              <span className="setting-unit">minutes</span>
            </div>
            
            {/* Pomodoros Before Long Break */}
            <div className="setting-row">
              <label className="setting-label">Long Break After</label>
              <div className="setting-input-group" style={dynamicStyles.settingInputGroup}>
                <button
                  onClick={() => setPomodorosBeforeLongBreak(prev => Math.max(1, prev - 1))}
                  className="setting-button"
                  style={{ ...dynamicStyles.settingInput, ...dynamicStyles.borderRight }}
                >
                  −
                </button>
                <input
                  type="text"
                  value={pomodorosBeforeLongBreak}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setPomodorosBeforeLongBreak(1);
                    } else {
                      const num = parseInt(value, 10);
                      if (!isNaN(num)) {
                        setPomodorosBeforeLongBreak(Math.max(1, Math.min(12, num)));
                      }
                    }
                  }}
                  className="setting-input"
                  style={dynamicStyles.settingInput}
                />
                <button
                  onClick={() => setPomodorosBeforeLongBreak(prev => Math.min(12, prev + 1))}
                  className="setting-button"
                  style={{ ...dynamicStyles.settingInput, ...dynamicStyles.borderLeft }}
                >
                  +
                </button>
              </div>
              <span className="setting-unit">pomodoros</span>
            </div>
            
            {/* Reset Pomodoros Button */}
            <button
              className="close-settings-button"
              onClick={() => setPomodoroCount(0)}
              style={dynamicStyles.actionButton}
            >
              Reset Pomodoros
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode Selector */}
      <div className="mode-selector">
        <button
          className="mode-button"
          onClick={() => handleModeChange('work')}
          style={mode === 'work' ? dynamicStyles.modeButtonActive : dynamicStyles.modeButtonInactive}
        >
          Focus
        </button>
        <button
          className="mode-button"
          onClick={() => handleModeChange('break')}
          style={mode === 'break' ? dynamicStyles.modeButtonActive : dynamicStyles.modeButtonInactive}
        >
          Short Break
        </button>
        <button
          className="mode-button"
          onClick={() => handleModeChange('longBreak')}
          style={mode === 'longBreak' ? dynamicStyles.modeButtonActive : dynamicStyles.modeButtonInactive}
        >
          Long Break
        </button>
      </div>

      {/* Timer Circle */}
      <div className="timer-container">
        <div
          ref={breathingAnimationRef}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <svg width="600" height="600" viewBox="0 0 800 800" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>            
            <circle
              cx="400"
              cy="400"
              r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={-strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            />
          </svg>
          
          <div style={{ textAlign: 'center', zIndex: 1 }}>
            {isEditingTimer ? (
              <div ref={timerInputRef} className="timer-edit-container">
                <input
                  className="timer-edit-input"
                  style={dynamicStyles.timerEditInput}
                  value={editTimerValue || formatTime(timeLeft)}
                  onChange={handleTimerInputChange}
                  onKeyDown={handleTimerKeyPress}
                  onBlur={handleTimerEditComplete}
                  autoFocus
                  placeholder={formatTime(timeLeft)}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </div>
            ) : (
              <h1 
                className="timer-text"
                onClick={handleTimerClick}
                style={{ cursor: isRunning ? 'default' : 'pointer' }}
              >
                {formatTime(timeLeft)}
              </h1>
            )}
            <h2 className="timer-mode">{mode === 'work' ? 'Focus Time' : mode === 'break' ? 'Short Break' : 'Long Break'}</h2>
            <p className="pomodoro-count">Pomodoros: {pomodoroCount}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls">
        <button
          onClick={handleStartPause}
          className="control-button start-button"
          style={dynamicStyles.actionButton}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={handleReset}
          className="control-button reset-button"
          style={dynamicStyles.resetButton}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;
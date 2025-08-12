import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Pomodoro Timer App', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Initial Render', () => {
    test('renders the app with default timer', () => {
      render(<App />);
      
      expect(screen.getByText('25:00')).toBeInTheDocument();
      expect(screen.getByText('Focus Time')).toBeInTheDocument();
      expect(screen.getByText('Completed: 0 pomodoros')).toBeInTheDocument();
    });

    test('renders all mode buttons', () => {
      render(<App />);
      
      expect(screen.getByText('Focus')).toBeInTheDocument();
      expect(screen.getByText('Short Break')).toBeInTheDocument();
      expect(screen.getByText('Long Break')).toBeInTheDocument();
    });

    test('renders control buttons', () => {
      render(<App />);
      
      expect(screen.getByText('Start')).toBeInTheDocument();
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    test('renders header controls', () => {
      render(<App />);
      
      expect(screen.getByText('Dark')).toBeInTheDocument();
      expect(screen.getByText('Classic')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
  });

  describe('Timer Functionality', () => {
    test('starts timer when start button is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const startButton = screen.getByText('Start');
      await user.click(startButton);
      
      expect(screen.getByText('Pause')).toBeInTheDocument();
    });

    test('pauses timer when pause button is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const startButton = screen.getByText('Start');
      await user.click(startButton);
      
      const pauseButton = screen.getByText('Pause');
      await user.click(pauseButton);
      
      expect(screen.getByText('Start')).toBeInTheDocument();
    });

    test('resets timer when reset button is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const startButton = screen.getByText('Start');
      await user.click(startButton);
      
      // Wait a bit for timer to start
      await waitFor(() => {
        expect(screen.getByText('Pause')).toBeInTheDocument();
      });
      
      const resetButton = screen.getByText('Reset');
      await user.click(resetButton);
      
      expect(screen.getByText('Start')).toBeInTheDocument();
      expect(screen.getByText('25:00')).toBeInTheDocument();
    });
  });

  describe('Mode Switching', () => {
    test('switches to short break mode', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const shortBreakButton = screen.getByText('Short Break');
      await user.click(shortBreakButton);
      
      // Check the timer display shows the correct time
      expect(screen.getByText('05:00')).toBeInTheDocument();
    });

    test('switches to long break mode', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const longBreakButton = screen.getByText('Long Break');
      await user.click(longBreakButton);
      
      // Check the timer display shows the correct time
      expect(screen.getByText('15:00')).toBeInTheDocument();
    });

    test('switches back to focus mode', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const shortBreakButton = screen.getByText('Short Break');
      await user.click(shortBreakButton);
      
      const focusButton = screen.getByText('Focus');
      await user.click(focusButton);
      
      expect(screen.getByText('Focus Time')).toBeInTheDocument();
      expect(screen.getByText('25:00')).toBeInTheDocument();
    });
  });

  describe('Settings Panel', () => {
    test('opens settings panel when settings button is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const settingsButton = screen.getByText('Settings');
      await user.click(settingsButton);
      
      expect(screen.getByText('Timer Settings')).toBeInTheDocument();
    });

    test('closes settings panel when settings button is clicked again', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const settingsButton = screen.getByText('Settings');
      await user.click(settingsButton);
      
      // Wait for settings to open
      await waitFor(() => {
        expect(screen.getByText('Timer Settings')).toBeInTheDocument();
      });
      
      await user.click(settingsButton);
      
      // Wait for settings to close
      await waitFor(() => {
        expect(screen.queryByText('Timer Settings')).not.toBeInTheDocument();
      });
    });
  });

  describe('Theme Selection', () => {
    test('opens theme selector when theme button is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const themeButton = screen.getByText('Classic');
      await user.click(themeButton);
      
      expect(screen.getByText('Choose Theme')).toBeInTheDocument();
    });

    test('displays all available themes', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const themeButton = screen.getByText('Classic');
      await user.click(themeButton);
      
      // Wait for theme panel to open
      await waitFor(() => {
        expect(screen.getByText('Choose Theme')).toBeInTheDocument();
      });
      
      // Check for theme options in the theme panel
      const themePanel = screen.getByText('Choose Theme').closest('.theme-panel');
      expect(themePanel).toBeInTheDocument();
      
      // Check for specific themes using more specific selectors
      expect(screen.getByLabelText('Select Classic theme')).toBeInTheDocument();
      expect(screen.getByLabelText('Select Forest theme')).toBeInTheDocument();
      expect(screen.getByLabelText('Select Ocean theme')).toBeInTheDocument();
      expect(screen.getByLabelText('Select Sunset theme')).toBeInTheDocument();
      expect(screen.getByLabelText('Select Minimal theme')).toBeInTheDocument();
      expect(screen.getByLabelText('Select Purple theme')).toBeInTheDocument();
      expect(screen.getByLabelText('Select Nordic theme')).toBeInTheDocument();
      expect(screen.getByLabelText('Select Warm theme')).toBeInTheDocument();
    });
  });

  describe('Dark Mode Toggle', () => {
    test('toggles between light and dark mode', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const darkModeButton = screen.getByText('Dark');
      await user.click(darkModeButton);
      
      expect(screen.getByText('Light')).toBeInTheDocument();
      
      await user.click(screen.getByText('Light'));
      expect(screen.getByText('Dark')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels', () => {
      render(<App />);
      
      expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
      expect(screen.getByLabelText('Change theme')).toBeInTheDocument();
      expect(screen.getByLabelText('Volume control')).toBeInTheDocument();
      expect(screen.getByLabelText('Open settings')).toBeInTheDocument();
      expect(screen.getByLabelText('Start timer')).toBeInTheDocument();
      expect(screen.getByLabelText('Reset timer')).toBeInTheDocument();
    });
  });
});

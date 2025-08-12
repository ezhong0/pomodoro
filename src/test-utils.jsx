import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Custom render function that includes providers if needed
export const customRender = (ui, options = {}) => {
  const AllTheProviders = ({ children }) => {
    return children;
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
};

// Helper to wait for timer to complete
export const waitForTimer = async (user, startButton, durationMs = 1000) => {
  await user.click(startButton);
  
  // Fast forward time
  jest.advanceTimersByTime(durationMs);
  
  // Wait for state updates
  await new Promise(resolve => setTimeout(resolve, 0));
};

// Helper to open settings panel
export const openSettings = async (user) => {
  const settingsButton = screen.getByText('Settings');
  await user.click(settingsButton);
};

// Helper to open theme selector
export const openThemeSelector = async (user) => {
  const themeButton = screen.getByText('Classic');
  await user.click(themeButton);
};

// Helper to change timer duration
export const changeTimerDuration = async (user, settingName, newValue) => {
  await openSettings(user);
  
  const input = screen.getByDisplayValue(/\d+/);
  await user.clear(input);
  await user.type(input, newValue.toString());
  
  // Close settings
  await user.click(screen.getByText('Settings'));
};

// Helper to start and complete a pomodoro
export const completePomodoro = async (user, durationMinutes = 25) => {
  const startButton = screen.getByText('Start');
  await user.click(startButton);
  
  // Fast forward to complete the pomodoro
  const durationMs = durationMinutes * 60 * 1000;
  jest.advanceTimersByTime(durationMs);
  
  // Wait for state updates
  await new Promise(resolve => setTimeout(resolve, 0));
};

// Helper to check if element is visible
export const isVisible = (element) => {
  if (!element) return false;
  
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && 
         style.visibility !== 'hidden' && 
         style.opacity !== '0';
};

// Helper to mock localStorage with specific values
export const mockLocalStorage = (mockData = {}) => {
  const mock = {
    getItem: jest.fn((key) => mockData[key] || null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  
  Object.defineProperty(window, 'localStorage', {
    value: mock,
    writable: true,
  });
  
  return mock;
};

// Helper to create a timer with specific settings
export const createTimerWithSettings = (settings = {}) => {
  const defaultSettings = {
    workMinutes: 25,
    breakMinutes: 5,
    longBreakMinutes: 15,
    pomodorosBeforeLongBreak: 4,
    autoTransition: true,
    darkMode: false,
    currentTheme: 'classic',
    volume: 1,
    muted: false,
    pomodoroCount: 0,
  };
  
  const finalSettings = { ...defaultSettings, ...settings };
  
  // Mock localStorage with settings
  mockLocalStorage({
    workMinutes: finalSettings.workMinutes.toString(),
    breakMinutes: finalSettings.breakMinutes.toString(),
    longBreakMinutes: finalSettings.longBreakMinutes.toString(),
    pomodorosBeforeLongBreak: finalSettings.pomodorosBeforeLongBreak.toString(),
    autoTransition: finalSettings.autoTransition.toString(),
    darkMode: finalSettings.darkMode.toString(),
    currentTheme: finalSettings.currentTheme,
    volume: finalSettings.volume.toString(),
    muted: finalSettings.muted.toString(),
    pomodoroCount: finalSettings.pomodoroCount.toString(),
  });
  
  return finalSettings;
};

// Helper to check accessibility
export const checkAccessibility = (container) => {
  // Check for proper heading hierarchy
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  
  headings.forEach(heading => {
    const level = parseInt(heading.tagName.charAt(1));
    expect(level).toBeGreaterThanOrEqual(previousLevel);
    expect(level).toBeLessThanOrEqual(previousLevel + 1);
    previousLevel = level;
  });
  
  // Check for proper button labels
  const buttons = container.querySelectorAll('button');
  buttons.forEach(button => {
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      console.warn('Button without accessible label:', button);
    }
  });
  
  // Check for proper form labels
  const inputs = container.querySelectorAll('input');
  inputs.forEach(input => {
    if (input.type !== 'hidden' && !input.getAttribute('aria-label')) {
      const label = input.closest('label');
      if (!label || !label.textContent.trim()) {
        console.warn('Input without accessible label:', input);
      }
    }
  });
};

// Helper to simulate user workflow
export const simulateUserWorkflow = async (user) => {
  // 1. Start a pomodoro
  const startButton = screen.getByText('Start');
  await user.click(startButton);
  
  // 2. Wait a bit
  jest.advanceTimersByTime(5 * 60 * 1000); // 5 minutes
  
  // 3. Pause
  const pauseButton = screen.getByText('Pause');
  await user.click(pauseButton);
  
  // 4. Resume
  const resumeButton = screen.getByText('Start');
  await user.click(resumeButton);
  
  // 5. Complete the pomodoro
  jest.advanceTimersByTime(20 * 60 * 1000); // Remaining 20 minutes
  
  // 6. Wait for break to start
  await new Promise(resolve => setTimeout(resolve, 0));
  
  return {
    pomodoroCompleted: screen.getByText('Completed: 1 pomodoros'),
    inBreakMode: screen.getByText('Short Break'),
  };
};

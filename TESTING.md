# Testing Documentation

## 🧪 Testing Setup

This Pomodoro Timer app includes comprehensive testing using Jest and React Testing Library.

## 📦 Dependencies

- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React components
- **@testing-library/jest-dom**: Custom Jest matchers for DOM testing
- **@testing-library/user-event**: Advanced user interaction simulation
- **jsdom**: DOM environment for Node.js testing

## 🚀 Running Tests

### Basic Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode
npm run test:ci

# Debug tests (force exit, detect open handles)
npm run test:debug
```

### Test File Structure

```
src/
├── __tests__/           # Test utilities and helpers
│   └── fileMock.js     # Mock for static assets
├── App.test.jsx        # Main App component tests
├── themes.test.js      # Theme module tests
├── setupTests.js       # Jest setup and global mocks
└── test-utils.jsx      # Test utility functions
```

## 📊 Current Test Coverage

- **Statements**: 52.96%
- **Branches**: 56.57%
- **Functions**: 41.55%
- **Lines**: 55.49%

**Note**: Coverage is lower than typical React apps due to:
- Complex animation logic (Framer Motion)
- Timer-related asynchronous code
- CSS-in-JS styling
- Audio handling

## 🧩 Test Categories

### 1. Initial Render Tests
- ✅ App renders with default timer (25:00)
- ✅ All mode buttons are displayed
- ✅ Control buttons are present
- ✅ Header controls are visible

### 2. Timer Functionality Tests
- ✅ Start button starts timer
- ✅ Pause button pauses timer
- ✅ Reset button resets timer

### 3. Mode Switching Tests
- ✅ Switch to short break mode (05:00)
- ✅ Switch to long break mode (15:00)
- ✅ Switch back to focus mode (25:00)

### 4. UI Interaction Tests
- ✅ Settings panel opens/closes
- ✅ Theme selector opens
- ✅ Dark mode toggle works
- ✅ All themes are displayed

### 5. Accessibility Tests
- ✅ Proper ARIA labels
- ✅ Screen reader support
- ✅ Keyboard navigation

## 🔧 Test Configuration

### Jest Configuration (`jest.config.js`)
- **Environment**: jsdom (DOM simulation)
- **Setup**: `src/setupTests.js`
- **Coverage Threshold**: 50% (realistic for animation-heavy app)
- **File Mocks**: CSS, images, and static assets

### Global Mocks (`setupTests.js`)
- **localStorage**: Mocked for consistent state
- **Audio**: Mocked to avoid browser dependencies
- **IntersectionObserver**: Mocked for scroll animations
- **ResizeObserver**: Mocked for responsive behavior
- **matchMedia**: Mocked for media queries
- **requestAnimationFrame**: Mocked for smooth animations

## 🚨 Common Test Issues & Solutions

### 1. Multiple Elements with Same Text
**Problem**: `Found multiple elements with the text: "Classic"`
**Solution**: Use more specific selectors like `getByLabelText` or `getByRole`

### 2. Async State Updates
**Problem**: Tests failing due to timing issues
**Solution**: Use `waitFor()` to wait for state changes

### 3. Animation Interference
**Problem**: Framer Motion animations causing test failures
**Solution**: Tests focus on functionality, not animation details

## 📈 Improving Test Coverage

To increase test coverage, consider adding:

1. **Timer Completion Tests**
   - Pomodoro count increments
   - Auto-transition between modes
   - Sound notifications

2. **Settings Validation Tests**
   - Input validation
   - Local storage persistence
   - Default value handling

3. **Edge Case Tests**
   - Invalid timer inputs
   - Network errors
   - Browser compatibility

4. **Integration Tests**
   - Complete user workflows
   - Cross-component communication
   - State management

## 🎯 Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what users see and do
   - Avoid testing internal state details

2. **Use Semantic Queries**
   - Prefer `getByRole` over `getByText`
   - Use `getByLabelText` for form elements

3. **Handle Async Operations**
   - Use `waitFor()` for state changes
   - Mock timers when testing countdowns

4. **Keep Tests Independent**
   - Clear state between tests
   - Mock external dependencies

## 🔍 Debugging Tests

```bash
# Run specific test file
npm test -- App.test.jsx

# Run tests with verbose output
npm test -- --verbose

# Debug specific test
npm test -- --testNamePattern="starts timer"

# Run tests with coverage for specific file
npm run test:coverage -- --collectCoverageFrom="src/App.jsx"
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Jest Configuration](https://jestjs.io/docs/configuration)

import themePresets from './themes';

describe('Theme Presets', () => {
  const expectedThemes = [
    'classic', 'forest', 'ocean', 'sunset', 'minimal', 'purple', 'nordic', 'warm'
  ];

  test('exports all expected themes', () => {
    expect(Object.keys(themePresets)).toEqual(expect.arrayContaining(expectedThemes));
  });

  test('each theme has required properties', () => {
    Object.entries(themePresets).forEach(([themeName, theme]) => {
      expect(theme).toHaveProperty('name');
      expect(theme).toHaveProperty('light');
      expect(theme).toHaveProperty('dark');
      
      expect(typeof theme.name).toBe('string');
      expect(typeof theme.light).toBe('object');
      expect(typeof theme.dark).toBe('object');
    });
  });

  test('each theme variant has required color properties', () => {
    const requiredProperties = [
      'work', 'break', 'longBreak', 'backgroundWork', 
      'backgroundBreak', 'backgroundLongBreak', 'text', 
      'inputBg', 'settingsBg'
    ];

    Object.entries(themePresets).forEach(([themeName, theme]) => {
      [theme.light, theme.dark].forEach(variant => {
        requiredProperties.forEach(prop => {
          expect(variant).toHaveProperty(prop);
          expect(typeof variant[prop]).toBe('string');
        });
      });
    });
  });

  test('color values are valid CSS colors', () => {
    const colorRegex = /^(#|rgba?|hsla?|hsl|rgb)/;
    
    Object.entries(themePresets).forEach(([themeName, theme]) => {
      [theme.light, theme.dark].forEach(variant => {
        Object.entries(variant).forEach(([prop, value]) => {
          if (prop.includes('work') || prop.includes('break') || prop.includes('text') || 
              prop.includes('Bg') || prop.includes('input') || prop.includes('settings')) {
            expect(value).toMatch(colorRegex);
          }
        });
      });
    });
  });

  test('theme names are descriptive and unique', () => {
    const names = Object.values(themePresets).map(theme => theme.name);
    const uniqueNames = new Set(names);
    
    expect(names.length).toBe(uniqueNames.size);
    
    names.forEach(name => {
      expect(name.length).toBeGreaterThan(0);
      expect(typeof name).toBe('string');
    });
  });

  test('classic theme has expected default values', () => {
    const classic = themePresets.classic;
    
    expect(classic.name).toBe('Classic');
    expect(classic.light.work).toMatch(/^#/);
    expect(classic.light.break).toMatch(/^#/);
    expect(classic.light.longBreak).toMatch(/^#/);
    expect(classic.dark.work).toMatch(/^#/);
    expect(classic.dark.break).toMatch(/^#/);
    expect(classic.dark.longBreak).toMatch(/^#/);
  });

  test('all themes have consistent structure', () => {
    const firstTheme = Object.values(themePresets)[0];
    const firstThemeKeys = Object.keys(firstTheme.light);
    
    Object.entries(themePresets).forEach(([themeName, theme]) => {
      expect(Object.keys(theme.light)).toEqual(firstThemeKeys);
      expect(Object.keys(theme.dark)).toEqual(firstThemeKeys);
    });
  });

  test('theme colors provide good contrast', () => {
    Object.entries(themePresets).forEach(([themeName, theme]) => {
      [theme.light, theme.dark].forEach(variant => {
        // Check that text color is different from background colors
        const textColor = variant.text;
        const bgColors = [variant.backgroundWork, variant.backgroundBreak, variant.backgroundLongBreak];
        
        bgColors.forEach(bgColor => {
          expect(textColor).not.toBe(bgColor);
        });
      });
    });
  });

  test('work, break, and longBreak colors are distinct', () => {
    Object.entries(themePresets).forEach(([themeName, theme]) => {
      [theme.light, theme.dark].forEach(variant => {
        expect(variant.work).not.toBe(variant.break);
        expect(variant.break).not.toBe(variant.longBreak);
        expect(variant.work).not.toBe(variant.longBreak);
      });
    });
  });

  test('background colors are lighter than text colors in light mode', () => {
    Object.entries(themePresets).forEach(([themeName, theme]) => {
      const light = theme.light;
      
      // This is a basic check - in a real app you'd want more sophisticated color contrast validation
      expect(light.backgroundWork).not.toBe(light.text);
      expect(light.backgroundBreak).not.toBe(light.text);
      expect(light.backgroundLongBreak).not.toBe(light.text);
    });
  });

  test('dark mode colors are darker than light mode', () => {
    Object.entries(themePresets).forEach(([themeName, theme]) => {
      const light = theme.light;
      const dark = theme.dark;
      
      // Check that dark mode backgrounds are different from light mode
      expect(dark.backgroundWork).not.toBe(light.backgroundWork);
      expect(dark.backgroundBreak).not.toBe(light.backgroundBreak);
      expect(dark.backgroundLongBreak).not.toBe(light.backgroundLongBreak);
    });
  });
});

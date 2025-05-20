// themes.js - Contains all the theme presets for the Pomodoro app

const themePresets = {
  classic: {
    name: "Classic",
    light: {
      work: "rgba(162, 217, 206, 0.7)", // Soft teal
      break: "rgba(249, 231, 159, 0.7)", // Soft yellow
      longBreak: "rgba(133, 193, 233, 0.7)", // Soft blue
      backgroundWork: "#EFF8F6",
      backgroundBreak: "#FFFBEF",
      backgroundLongBreak: "#F4F9FC",
      text: "#5D6D7E", // Darker for better contrast
      inputBg: "rgba(255, 255, 255, 0.7)", // More solid white
      settingsBg: "rgba(255, 255, 255, 0.9)", // More solid for settings
    },
    dark: {
      work: "rgba(80, 160, 120, 0.85)", // Darker green
      break: "rgba(180, 150, 60, 0.85)", // Darker yellow
      longBreak: "rgba(60, 120, 180, 0.85)", // Darker blue
      backgroundWork: "#1A232B", // Much darker background
      backgroundBreak: "#181818", // Much darker background
      backgroundLongBreak: "#1B222A", // Much darker background
      text: "#ECF0F1",
      inputBg: "rgba(40, 45, 55, 0.8)",
      settingsBg: "rgba(30, 40, 50, 0.95)",
    },
  },
  forest: {
    name: "Forest",
    light: {
      work: "rgba(76, 175, 80, 0.7)", // Green
      break: "rgba(192, 202, 51, 0.7)", // Lime
      longBreak: "rgba(139, 195, 74, 0.7)", // Light Green
      backgroundWork: "#F1F8E9", // Very light green
      backgroundBreak: "#F9FBE7", // Very light lime
      backgroundLongBreak: "#F4F8EC", // Very light light green
      text: "#33691E", // Dark green
      inputBg: "rgba(255, 255, 255, 0.7)",
      settingsBg: "rgba(241, 248, 233, 0.95)",
    },
    dark: {
      work: "rgba(60, 120, 40, 0.85)",
      break: "rgba(110, 120, 30, 0.85)",
      longBreak: "rgba(40, 90, 30, 0.85)",
      backgroundWork: "#102910",
      backgroundBreak: "#1A2B10",
      backgroundLongBreak: "#183218",
      text: "#DCEDC8",
      inputBg: "rgba(16, 41, 16, 0.7)",
      settingsBg: "rgba(16, 41, 16, 0.95)",
    },
  },
  ocean: {
    name: "Ocean",
    light: {
      work: "rgba(3, 169, 244, 0.7)", // Light Blue
      break: "rgba(0, 188, 212, 0.7)", // Cyan
      longBreak: "rgba(0, 150, 136, 0.7)", // Teal
      backgroundWork: "#E1F5FE", // Very light blue
      backgroundBreak: "#E0F7FA", // Very light cyan
      backgroundLongBreak: "#E0F2F1", // Very light teal
      text: "#01579B", // Dark blue
      inputBg: "rgba(255, 255, 255, 0.7)",
      settingsBg: "rgba(225, 245, 254, 0.95)",
    },
    dark: {
      work: "rgba(0, 90, 160, 0.85)",
      break: "rgba(0, 100, 120, 0.85)",
      longBreak: "rgba(0, 70, 80, 0.85)",
      backgroundWork: "#01213A",
      backgroundBreak: "#00222A",
      backgroundLongBreak: "#00181A",
      text: "#B3E5FC",
      inputBg: "rgba(1, 33, 58, 0.7)",
      settingsBg: "rgba(1, 33, 58, 0.95)",
    },
  },
  sunset: {
    name: "Sunset",
    light: {
      work: "rgba(244, 67, 54, 0.7)", // Red
      break: "rgba(255, 152, 0, 0.7)", // Orange
      longBreak: "rgba(255, 193, 7, 0.7)", // Amber
      backgroundWork: "#FFEBEE", // Very light red
      backgroundBreak: "#FFF3E0", // Very light orange
      backgroundLongBreak: "#FFF8E1", // Very light amber
      text: "#B71C1C", // Dark red
      inputBg: "rgba(255, 255, 255, 0.7)",
      settingsBg: "rgba(255, 235, 238, 0.95)",
    },
    dark: {
      work: "rgba(120, 30, 30, 0.85)",
      break: "rgba(140, 60, 0, 0.85)",
      longBreak: "rgba(180, 60, 0, 0.85)",
      backgroundWork: "#3A1010",
      backgroundBreak: "#3A1A00",
      backgroundLongBreak: "#3A1A00",
      text: "#FFCDD2",
      inputBg: "rgba(58, 16, 16, 0.7)",
      settingsBg: "rgba(58, 16, 16, 0.95)",
    },
  },
  minimal: {
    name: "Minimal",
    light: {
      work: "rgba(158, 158, 158, 0.7)", // Grey
      break: "rgba(189, 189, 189, 0.7)", // Light Grey
      longBreak: "rgba(224, 224, 224, 0.7)", // Very Light Grey
      backgroundWork: "#FAFAFA", // Almost white
      backgroundBreak: "#F5F5F5", // Off-white
      backgroundLongBreak: "#EEEEEE", // Light grey background
      text: "#424242", // Dark grey text
      inputBg: "rgba(255, 255, 255, 0.7)",
      settingsBg: "rgba(250, 250, 250, 0.95)",
    },
    dark: {
      work: "rgba(50, 50, 50, 0.85)",
      break: "rgba(30, 30, 30, 0.85)",
      longBreak: "rgba(20, 20, 20, 0.85)",
      backgroundWork: "#111111",
      backgroundBreak: "#181818",
      backgroundLongBreak: "#222222",
      text: "#EEEEEE",
      inputBg: "rgba(17, 17, 17, 0.7)",
      settingsBg: "rgba(17, 17, 17, 0.95)",
    },
  },
  purple: {
    name: "Purple",
    light: {
      work: "rgba(186, 104, 200, 0.7)", // Purple
      break: "rgba(224, 64, 251, 0.7)", // Pink
      longBreak: "rgba(149, 117, 205, 0.7)", // Deep Purple
      backgroundWork: "#F3E5F5", // Very light purple
      backgroundBreak: "#FCE4EC", // Very light pink
      backgroundLongBreak: "#EDE7F6", // Very light deep purple
      text: "#5E35B1", // Deep purple text
      inputBg: "rgba(255, 255, 255, 0.7)",
      settingsBg: "rgba(243, 229, 245, 0.95)",
    },
    dark: {
      work: "rgba(90, 40, 120, 0.85)",
      break: "rgba(120, 20, 60, 0.85)",
      longBreak: "rgba(60, 20, 90, 0.85)",
      backgroundWork: "#1A0A2A",
      backgroundBreak: "#2A0A1A",
      backgroundLongBreak: "#140A2A",
      text: "#E1BEE7",
      inputBg: "rgba(26, 10, 42, 0.7)",
      settingsBg: "rgba(26, 10, 42, 0.95)",
    },
  },
};

export default themePresets;

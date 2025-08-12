// Modern theme presets for the Pomodoro app

const themePresets = {
  classic: {
    name: "Classic",
    light: {
      work: "#10B981", // Emerald green
      break: "#F59E0B", // Amber
      longBreak: "#3B82F6", // Blue
      backgroundWork: "#F0FDF4", // Very light green
      backgroundBreak: "#FFFBEB", // Very light amber
      backgroundLongBreak: "#EFF6FF", // Very light blue
      text: "#1F2937", // Dark gray
      inputBg: "rgba(255, 255, 255, 0.8)",
      settingsBg: "rgba(255, 255, 255, 0.95)",
    },
    dark: {
      work: "#059669", // Darker emerald
      break: "#D97706", // Darker amber
      longBreak: "#2563EB", // Darker blue
      backgroundWork: "#064E3B", // Very dark green
      backgroundBreak: "#451A03", // Very dark amber
      backgroundLongBreak: "#1E3A8A", // Very dark blue
      text: "#F9FAFB", // Light gray
      inputBg: "rgba(17, 24, 39, 0.8)",
      settingsBg: "rgba(17, 24, 39, 0.95)",
    },
  },
  forest: {
    name: "Forest",
    light: {
      work: "#16A34A", // Green
      break: "#84CC16", // Lime
      longBreak: "#22C55E", // Light green
      backgroundWork: "#F0FDF4", // Very light green
      backgroundBreak: "#F7FEE7", // Very light lime
      backgroundLongBreak: "#F0FDF4", // Very light green
      text: "#166534", // Dark green
      inputBg: "rgba(255, 255, 255, 0.8)",
      settingsBg: "rgba(240, 253, 244, 0.95)",
    },
    dark: {
      work: "#15803D", // Darker green
      break: "#65A30D", // Darker lime
      longBreak: "#16A34A", // Darker light green
      backgroundWork: "#052E16", // Very dark green
      backgroundBreak: "#1A2E05", // Very dark lime
      backgroundLongBreak: "#052E16", // Very dark green
      text: "#DCFCE7", // Light green
      inputBg: "rgba(5, 46, 22, 0.8)",
      settingsBg: "rgba(5, 46, 22, 0.95)",
    },
  },
  ocean: {
    name: "Ocean",
    light: {
      work: "#0891B2", // Cyan
      break: "#06B6D4", // Light cyan
      longBreak: "#0EA5E9", // Sky blue
      backgroundWork: "#F0FDFA", // Very light cyan
      backgroundBreak: "#F0FDFA", // Very light cyan
      backgroundLongBreak: "#F0F9FF", // Very light sky blue
      text: "#0E7490", // Dark cyan
      inputBg: "rgba(255, 255, 255, 0.8)",
      settingsBg: "rgba(240, 253, 250, 0.95)",
    },
    dark: {
      work: "#0E7490", // Darker cyan
      break: "#0891B2", // Darker light cyan
      longBreak: "#0369A1", // Darker sky blue
      backgroundWork: "#042F2E", // Very dark cyan
      backgroundBreak: "#042F2E", // Very dark cyan
      backgroundLongBreak: "#0C4A6E", // Very dark sky blue
      text: "#CFFAFE", // Light cyan
      inputBg: "rgba(4, 47, 46, 0.8)",
      settingsBg: "rgba(4, 47, 46, 0.95)",
    },
  },
  sunset: {
    name: "Sunset",
    light: {
      work: "#EF4444", // Red
      break: "#F97316", // Orange
      longBreak: "#F59E0B", // Amber
      backgroundWork: "#FEF2F2", // Very light red
      backgroundBreak: "#FFF7ED", // Very light orange
      backgroundLongBreak: "#FFFBEB", // Very light amber
      text: "#B91C1C", // Dark red
      inputBg: "rgba(255, 255, 255, 0.8)",
      settingsBg: "rgba(254, 242, 242, 0.95)",
    },
    dark: {
      work: "#DC2626", // Darker red
      break: "#EA580C", // Darker orange
      longBreak: "#D97706", // Darker amber
      backgroundWork: "#450A0A", // Very dark red
      backgroundBreak: "#451A03", // Very dark orange
      backgroundLongBreak: "#451A03", // Very dark amber
      text: "#FEE2E2", // Light red
      inputBg: "rgba(69, 10, 10, 0.8)",
      settingsBg: "rgba(69, 10, 10, 0.95)",
    },
  },
  minimal: {
    name: "Minimal",
    light: {
      work: "#6B7280", // Gray
      break: "#9CA3AF", // Light gray
      longBreak: "#D1D5DB", // Very light gray
      backgroundWork: "#F9FAFB", // Almost white
      backgroundBreak: "#F3F4F6", // Off-white
      backgroundLongBreak: "#E5E7EB", // Light gray
      text: "#374151", // Dark gray
      inputBg: "rgba(255, 255, 255, 0.8)",
      settingsBg: "rgba(249, 250, 251, 0.95)",
    },
    dark: {
      work: "#4B5563", // Darker gray
      break: "#6B7280", // Darker light gray
      longBreak: "#9CA3AF", // Darker very light gray
      backgroundWork: "#111827", // Very dark gray
      backgroundBreak: "#1F2937", // Dark gray
      backgroundLongBreak: "#374151", // Medium gray
      text: "#F9FAFB", // Light gray
      inputBg: "rgba(17, 24, 39, 0.8)",
      settingsBg: "rgba(17, 24, 39, 0.95)",
    },
  },
  purple: {
    name: "Purple",
    light: {
      work: "#8B5CF6", // Purple
      break: "#EC4899", // Pink
      longBreak: "#A855F7", // Deep purple
      backgroundWork: "#FAF5FF", // Very light purple
      backgroundBreak: "#FDF2F8", // Very light pink
      backgroundLongBreak: "#F5F3FF", // Very light deep purple
      text: "#6D28D9", // Dark purple
      inputBg: "rgba(255, 255, 255, 0.8)",
      settingsBg: "rgba(250, 245, 255, 0.95)",
    },
    dark: {
      work: "#7C3AED", // Darker purple
      break: "#DB2777", // Darker pink
      longBreak: "#9333EA", // Darker deep purple
      backgroundWork: "#2E1065", // Very dark purple
      backgroundBreak: "#831843", // Very dark pink
      backgroundLongBreak: "#4C1D95", // Very dark deep purple
      text: "#F3E8FF", // Light purple
      inputBg: "rgba(46, 16, 101, 0.8)",
      settingsBg: "rgba(46, 16, 101, 0.95)",
    },
  },
  nordic: {
    name: "Nordic",
    light: {
      work: "#5E81AC", // Nordic blue
      break: "#81A1C1", // Light nordic blue
      longBreak: "#88C0D0", // Very light nordic blue
      backgroundWork: "#ECEFF4", // Very light gray-blue
      backgroundBreak: "#E5E9F0", // Light gray-blue
      backgroundLongBreak: "#D8DEE9", // Gray-blue
      text: "#2E3440", // Dark gray
      inputBg: "rgba(255, 255, 255, 0.8)",
      settingsBg: "rgba(236, 239, 244, 0.95)",
    },
    dark: {
      work: "#4C566A", // Darker nordic blue
      break: "#5E81AC", // Darker light nordic blue
      longBreak: "#81A1C1", // Darker very light nordic blue
      backgroundWork: "#2E3440", // Very dark gray
      backgroundBreak: "#3B4252", // Dark gray
      backgroundLongBreak: "#434C5E", // Medium gray
      text: "#ECEFF4", // Light gray
      inputBg: "rgba(46, 52, 64, 0.8)",
      settingsBg: "rgba(46, 52, 64, 0.95)",
    },
  },
  warm: {
    name: "Warm",
    light: {
      work: "#F59E0B", // Amber
      break: "#F97316", // Orange
      longBreak: "#EF4444", // Red
      backgroundWork: "#FFFBEB", // Very light amber
      backgroundBreak: "#FFF7ED", // Very light orange
      backgroundLongBreak: "#FEF2F2", // Very light red
      text: "#B45309", // Dark amber
      inputBg: "rgba(255, 255, 255, 0.8)",
      settingsBg: "rgba(255, 251, 235, 0.95)",
    },
    dark: {
      work: "#D97706", // Darker amber
      break: "#EA580C", // Darker orange
      longBreak: "#DC2626", // Darker red
      backgroundWork: "#451A03", // Very dark amber
      backgroundBreak: "#450A0A", // Very dark orange
      backgroundLongBreak: "#450A0A", // Very dark red
      text: "#FEF3C7", // Light amber
      inputBg: "rgba(69, 26, 3, 0.8)",
      settingsBg: "rgba(69, 26, 3, 0.95)",
    },
  },
};

export default themePresets;

// Reads CSS custom properties at runtime so Chart.js canvas colors
// stay in sync with the app's light/dark theme.
export const getChartColors = () => {
  const s = getComputedStyle(document.documentElement);
  const get = (v) => s.getPropertyValue(v).trim();

  const primary = get("--primary");
  const info = get("--info");

  return {
    primary,
    primaryFill: `color-mix(in srgb, ${primary} 25%, transparent)`,
    info,
    infoFill: `color-mix(in srgb, ${info} 15%, transparent)`,
    text: get("--text"),
    textMuted: get("--text-muted"),
    borderMuted: get("--border-muted"),
  };
};
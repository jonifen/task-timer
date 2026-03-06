import { globalStyle, style } from "@vanilla-extract/css";

import { vars } from "./theme.css";

globalStyle("*, *::before, *::after", {
  boxSizing: "border-box",
  margin: 0,
  padding: 0,
});

globalStyle("body", {
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
  color: vars.color.textPrimary,
});

export const root = style({
  minHeight: "100vh",
  background: `linear-gradient(135deg, ${vars.color.gradientFrom} 0%, ${vars.color.gradientTo} 100%)`,
});

import { style, keyframes } from "@vanilla-extract/css";

import { vars } from "../../theme.css";

const pulse = keyframes({
  "0%, 100%": { opacity: 1 },
  "50%": { opacity: 0.4 },
});

export const row = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space["3"],
  padding: `${vars.space["3"]} ${vars.space["4"]}`,
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radii.lg,
});

export const rowActive = style({
  borderColor: vars.color.timerActive,
});

export const colorDot = style({
  flexShrink: 0,
  width: "10px",
  height: "10px",
  borderRadius: vars.radii.full,
  backgroundColor: vars.color.border,
});

export const colorDotActive = style({
  animationName: pulse,
  animationDuration: "1.5s",
  animationTimingFunction: "ease-in-out",
  animationIterationCount: "infinite",
});

export const middle = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: vars.space["1"],
  minWidth: 0,
});

export const name = style({
  fontSize: vars.fontSizes.md,
  fontWeight: vars.fontWeights.medium,
  color: vars.color.textPrimary,
});

export const timeRange = style({
  fontSize: vars.fontSizes.xs,
  color: vars.color.textMuted,
  fontFamily: "ui-monospace, monospace",
});

export const right = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space["2"],
  flexShrink: 0,
});

export const statusIcon = style({
  fontSize: vars.fontSizes.sm,
  width: "16px",
  textAlign: "center",
  flexShrink: 0,
});

export const statusIconActive = style({
  color: vars.color.timerActive,
});

export const statusIconPaused = style({
  color: vars.color.timerPaused,
});

export const statusIconCompleted = style({
  color: vars.color.timerCompleted,
});

export const elapsed = style({
  fontFamily: "ui-monospace, monospace",
  fontSize: vars.fontSizes.md,
  fontWeight: vars.fontWeights.medium,
  color: vars.color.textPrimary,
  minWidth: "3.8ch",
  textAlign: "right",
});

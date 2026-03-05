import { style } from "@vanilla-extract/css";

import { vars } from "../../theme.css";

export const form = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space["4"],
  padding: vars.space["4"],
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radii.lg,
});

export const field = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space["2"],
});

export const label = style({
  fontSize: vars.fontSizes.sm,
  fontWeight: vars.fontWeights.medium,
  color: vars.color.textSecondary,
});

export const input = style({
  padding: `${vars.space["2"]} ${vars.space["3"]}`,
  fontSize: vars.fontSizes.md,
  color: vars.color.textPrimary,
  backgroundColor: vars.color.background,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radii.md,
  outline: "none",
  transition: `border-color ${vars.transitions.fast}`,

  ":focus": {
    borderColor: vars.color.accent,
  },
});

export const swatches = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.space["2"],
});

export const swatch = style({
  width: "28px",
  height: "28px",
  borderRadius: vars.radii.full,
  border: "2px solid transparent",
  cursor: "pointer",
  transition: `transform ${vars.transitions.fast}, border-color ${vars.transitions.fast}`,
  outline: "none",

  ":hover": {
    transform: "scale(1.15)",
  },

  ":focus-visible": {
    outline: `2px solid ${vars.color.accent}`,
    outlineOffset: "2px",
  },
});

export const swatchNone = style({
  backgroundColor: vars.color.surfaceHover,
  border: `2px solid ${vars.color.border}`,
  position: "relative",
  overflow: "hidden",

  "::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: `linear-gradient(135deg, transparent 45%, ${vars.color.danger} 45%, ${vars.color.danger} 55%, transparent 55%)`,
  },
});

export const swatchSelected = style({
  borderColor: vars.color.textPrimary,
  transform: "scale(1.15)",
});

export const actions = style({
  display: "flex",
  gap: vars.space["2"],
  justifyContent: "flex-end",
});

export const button = style({
  padding: `${vars.space["2"]} ${vars.space["4"]}`,
  borderRadius: vars.radii.md,
  fontSize: vars.fontSizes.sm,
  fontWeight: vars.fontWeights.medium,
  cursor: "pointer",
  border: "none",
  transition: `background-color ${vars.transitions.fast}, color ${vars.transitions.fast}`,
});

export const buttonPrimary = style({
  backgroundColor: vars.color.accent,
  color: vars.color.accentText,

  ":hover": {
    backgroundColor: vars.color.accentHover,
  },

  ":disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
});

export const buttonSecondary = style({
  backgroundColor: "transparent",
  color: vars.color.textSecondary,
  border: `1px solid ${vars.color.border}`,

  ":hover": {
    backgroundColor: vars.color.surfaceHover,
    color: vars.color.textPrimary,
  },
});

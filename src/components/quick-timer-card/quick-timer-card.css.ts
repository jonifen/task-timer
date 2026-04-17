import { style } from "@vanilla-extract/css";

import { vars } from "../../theme.css";

export const card = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space["3"],
  padding: vars.space["4"],
  backgroundColor: vars.color.surface,
  border: `2px solid ${vars.color.accent}`,
  borderRadius: vars.radii.lg,
});

export const top = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space["3"],
});

export const input = style({
  flex: 1,
  padding: `${vars.space["2"]} ${vars.space["3"]}`,
  fontSize: vars.fontSizes.md,
  fontWeight: vars.fontWeights.medium,
  color: vars.color.textPrimary,
  backgroundColor: vars.color.background,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radii.md,
  outline: "none",
  transition: `border-color ${vars.transitions.fast}`,

  "::placeholder": {
    color: vars.color.textMuted,
    fontWeight: vars.fontWeights.normal,
  },

  ":focus": {
    borderColor: vars.color.accent,
  },
});

export const elapsed = style({
  fontFamily: "ui-monospace, monospace",
  fontSize: vars.fontSizes.lg,
  fontWeight: vars.fontWeights.semibold,
  color: vars.color.timerActive,
  flexShrink: 0,
  minWidth: "4ch",
  textAlign: "right",
});

export const controls = style({
  display: "flex",
  gap: vars.space["2"],
  justifyContent: "flex-end",
});

export const button = style({
  padding: `${vars.space["2"]} ${vars.space["4"]}`,
  borderRadius: vars.radii.md,
  border: "none",
  fontSize: vars.fontSizes.sm,
  fontWeight: vars.fontWeights.medium,
  cursor: "pointer",
  transition: `background-color ${vars.transitions.fast}, color ${vars.transitions.fast}`,
});

export const buttonPrimary = style({
  backgroundColor: vars.color.accent,
  color: vars.color.accentText,

  ":hover": {
    backgroundColor: vars.color.accentHover,
  },
});

export const buttonSecondary = style({
  backgroundColor: vars.color.surfaceHover,
  color: vars.color.textPrimary,

  ":hover": {
    backgroundColor: vars.color.borderStrong,
  },
});

export const buttonComplete = style({
  backgroundColor: vars.color.success,
  color: vars.color.accentText,

  ":hover": {
    opacity: 0.85,
  },
});

import { style } from "@vanilla-extract/css";

import { vars } from "../../theme.css";

export const card = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space["3"],
  padding: `${vars.space["3"]} ${vars.space["4"]}`,
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radii.lg,
});

export const colorDot = style({
  flexShrink: 0,
  width: "12px",
  height: "12px",
  borderRadius: vars.radii.full,
  backgroundColor: vars.color.border,
});

export const name = style({
  flex: 1,
  fontSize: vars.fontSizes.md,
  fontWeight: vars.fontWeights.medium,
  color: vars.color.textPrimary,
});

export const timerSection = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space["2"],
  flexShrink: 0,
});

export const elapsed = style({
  fontFamily: "ui-monospace, monospace",
  fontSize: vars.fontSizes.md,
  fontWeight: vars.fontWeights.medium,
  color: vars.color.textPrimary,
  minWidth: "3.8ch",
  textAlign: "right",
});

export const timerButton = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "32px",
  padding: `0 ${vars.space["3"]}`,
  borderRadius: vars.radii.md,
  border: "none",
  cursor: "pointer",
  fontSize: vars.fontSizes.sm,
  fontWeight: vars.fontWeights.medium,
  transition: `background-color ${vars.transitions.fast}, color ${vars.transitions.fast}`,
});

export const timerButtonStart = style({
  backgroundColor: vars.color.accent,
  color: vars.color.accentText,

  ":hover": {
    backgroundColor: vars.color.accentHover,
  },
});

export const timerButtonSecondary = style({
  backgroundColor: vars.color.surfaceHover,
  color: vars.color.textPrimary,

  ":hover": {
    backgroundColor: vars.color.borderStrong,
  },
});

export const timerButtonComplete = style({
  backgroundColor: "transparent",
  color: vars.color.textMuted,
  border: `1px solid ${vars.color.border}`,

  ":hover": {
    backgroundColor: vars.color.success,
    borderColor: vars.color.success,
    color: vars.color.accentText,
  },
});

export const divider = style({
  width: "1px",
  alignSelf: "stretch",
  backgroundColor: vars.color.border,
  flexShrink: 0,
  margin: `0 ${vars.space["1"]}`,
});

export const manageActions = style({
  display: "flex",
  gap: vars.space["1"],
  flexShrink: 0,
});

export const iconButton = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  borderRadius: vars.radii.md,
  border: "none",
  backgroundColor: "transparent",
  color: vars.color.textMuted,
  cursor: "pointer",
  fontSize: vars.fontSizes.md,
  transition: `background-color ${vars.transitions.fast}, color ${vars.transitions.fast}`,

  ":hover": {
    backgroundColor: vars.color.surfaceHover,
    color: vars.color.textPrimary,
  },
});

export const iconButtonDanger = style({
  ":hover": {
    backgroundColor: vars.color.danger,
    color: vars.color.accentText,
  },
});

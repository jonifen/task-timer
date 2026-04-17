import { style } from "@vanilla-extract/css";

import { vars } from "../../theme.css";

export const overlay = style({
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 100,
  padding: vars.space["4"],
});

export const modal = style({
  backgroundColor: vars.color.background,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radii.lg,
  boxShadow: vars.shadows.lg,
  width: "100%",
  maxWidth: "420px",
  display: "flex",
  flexDirection: "column",
});

export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: `${vars.space["4"]} ${vars.space["5"]}`,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const title = style({
  fontSize: vars.fontSizes.lg,
  fontWeight: vars.fontWeights.semibold,
  color: vars.color.textPrimary,
  margin: 0,
});

export const closeButton = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "28px",
  height: "28px",
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

export const body = style({
  padding: vars.space["5"],
  display: "flex",
  flexDirection: "column",
  gap: vars.space["4"],
});

export const fieldGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space["1"],
});

export const label = style({
  fontSize: vars.fontSizes.sm,
  fontWeight: vars.fontWeights.medium,
  color: vars.color.textSecondary,
});

export const input = style({
  width: "100%",
  padding: `${vars.space["2"]} ${vars.space["3"]}`,
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radii.md,
  color: vars.color.textPrimary,
  fontSize: vars.fontSizes.md,
  fontFamily: "inherit",
  boxSizing: "border-box",
  transition: `border-color ${vars.transitions.fast}`,

  ":focus": {
    outline: "none",
    borderColor: vars.color.accent,
  },
});

export const workedTimeHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.space["2"],
});

export const recalcButton = style({
  display: "flex",
  alignItems: "center",
  padding: `2px ${vars.space["2"]}`,
  borderRadius: vars.radii.sm,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: "transparent",
  color: vars.color.textMuted,
  cursor: "pointer",
  fontSize: vars.fontSizes.xs,
  transition: `background-color ${vars.transitions.fast}, color ${vars.transitions.fast}`,

  ":hover": {
    backgroundColor: vars.color.surfaceHover,
    color: vars.color.textPrimary,
  },
});

export const durationRow = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space["2"],
  flexWrap: "wrap",
});

export const durationUnit = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space["1"],
});

export const durationInput = style({
  width: "64px",
  padding: `${vars.space["2"]} ${vars.space["2"]}`,
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radii.md,
  color: vars.color.textPrimary,
  fontSize: vars.fontSizes.md,
  fontFamily: "ui-monospace, monospace",
  textAlign: "center",
  boxSizing: "border-box",
  transition: `border-color ${vars.transitions.fast}`,

  ":focus": {
    outline: "none",
    borderColor: vars.color.accent,
  },
});

export const durationLabel = style({
  fontSize: vars.fontSizes.sm,
  color: vars.color.textMuted,
});

export const errorText = style({
  fontSize: vars.fontSizes.sm,
  color: vars.color.danger,
  margin: 0,
});

export const footer = style({
  display: "flex",
  justifyContent: "flex-end",
  gap: vars.space["2"],
  padding: `${vars.space["4"]} ${vars.space["5"]}`,
  borderTop: `1px solid ${vars.color.border}`,
});

export const cancelButton = style({
  display: "flex",
  alignItems: "center",
  height: "36px",
  padding: `0 ${vars.space["4"]}`,
  borderRadius: vars.radii.md,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: "transparent",
  color: vars.color.textSecondary,
  cursor: "pointer",
  fontSize: vars.fontSizes.sm,
  fontWeight: vars.fontWeights.medium,
  transition: `background-color ${vars.transitions.fast}`,

  ":hover": {
    backgroundColor: vars.color.surfaceHover,
  },
});

export const saveButton = style({
  display: "flex",
  alignItems: "center",
  height: "36px",
  padding: `0 ${vars.space["4"]}`,
  borderRadius: vars.radii.md,
  border: "none",
  backgroundColor: vars.color.accent,
  color: vars.color.accentText,
  cursor: "pointer",
  fontSize: vars.fontSizes.sm,
  fontWeight: vars.fontWeights.medium,
  transition: `background-color ${vars.transitions.fast}`,

  ":hover": {
    backgroundColor: vars.color.accentHover,
  },
});

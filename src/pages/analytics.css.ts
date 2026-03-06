import { style } from "@vanilla-extract/css";

import { vars } from "../theme.css";

export const page = style({
  maxWidth: "800px",
  margin: "0 auto",
  padding: vars.space["6"],
  display: "flex",
  flexDirection: "column",
  gap: vars.space["6"],
});

export const pageHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

export const heading = style({
  fontSize: vars.fontSizes["2xl"],
  fontWeight: vars.fontWeights.bold,
  color: vars.color.textPrimary,
});

export const exportButton = style({
  padding: `${vars.space["2"]} ${vars.space["4"]}`,
  borderRadius: vars.radii.md,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: "transparent",
  color: vars.color.textSecondary,
  fontSize: vars.fontSizes.sm,
  fontWeight: vars.fontWeights.medium,
  cursor: "pointer",
  transition: `background-color ${vars.transitions.fast}, color ${vars.transitions.fast}`,

  ":hover": {
    backgroundColor: vars.color.surfaceHover,
    color: vars.color.textPrimary,
  },

  ":disabled": {
    opacity: 0.5,
    cursor: "default",
  },
});

export const controls = style({
  display: "flex",
  alignItems: "flex-end",
  flexWrap: "wrap",
  gap: vars.space["4"],
  padding: vars.space["4"],
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radii.lg,
});

export const presets = style({
  display: "flex",
  gap: vars.space["2"],
  flexWrap: "wrap",
});

export const presetButton = style({
  padding: `${vars.space["2"]} ${vars.space["3"]}`,
  borderRadius: vars.radii.md,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: "transparent",
  color: vars.color.textSecondary,
  fontSize: vars.fontSizes.sm,
  fontWeight: vars.fontWeights.medium,
  cursor: "pointer",
  transition: `background-color ${vars.transitions.fast}, color ${vars.transitions.fast}, border-color ${vars.transitions.fast}`,

  ":hover": {
    backgroundColor: vars.color.surfaceHover,
    color: vars.color.textPrimary,
  },
});

export const presetButtonActive = style({
  backgroundColor: vars.color.accent,
  borderColor: vars.color.accent,
  color: vars.color.accentText,

  ":hover": {
    backgroundColor: vars.color.accentHover,
    color: vars.color.accentText,
  },
});

export const dateInputs = style({
  display: "flex",
  gap: vars.space["3"],
  flexWrap: "wrap",
  marginLeft: "auto",
});

export const dateLabel = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space["2"],
  fontSize: vars.fontSizes.sm,
  color: vars.color.textSecondary,
  fontWeight: vars.fontWeights.medium,
});

export const dateInput = style({
  padding: `${vars.space["1"]} ${vars.space["2"]}`,
  borderRadius: vars.radii.md,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.background,
  color: vars.color.textPrimary,
  fontSize: vars.fontSizes.sm,
  colorScheme: "light dark",

  ":focus": {
    outline: `2px solid ${vars.color.accent}`,
    outlineOffset: "1px",
  },
});

export const message = style({
  padding: vars.space["10"],
  textAlign: "center",
  color: vars.color.textMuted,
  fontSize: vars.fontSizes.md,
  border: `2px dashed ${vars.color.border}`,
  borderRadius: vars.radii.lg,
});

export const statsRow = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: vars.space["4"],
});

export const statCard = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space["1"],
  padding: vars.space["4"],
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radii.lg,
});

export const statValue = style({
  fontSize: vars.fontSizes["2xl"],
  fontWeight: vars.fontWeights.bold,
  color: vars.color.textPrimary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const statValueSuffix = style({
  fontSize: vars.fontSizes.md,
  fontWeight: vars.fontWeights.normal,
  color: vars.color.textMuted,
});

export const statLabel = style({
  fontSize: vars.fontSizes.sm,
  color: vars.color.textMuted,
});

export const chartSection = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space["3"],
  padding: vars.space["4"],
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radii.lg,
});

export const chartHeading = style({
  fontSize: vars.fontSizes.md,
  fontWeight: vars.fontWeights.semibold,
  color: vars.color.textPrimary,
});

export const chartWrap = style({
  color: vars.color.textMuted,
});

export const pieWrap = style({
  color: vars.color.textMuted,
});

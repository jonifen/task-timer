import { style } from "@vanilla-extract/css";

import { vars } from "../theme.css";

export const page = style({
  maxWidth: "600px",
  margin: "0 auto",
  padding: vars.space["6"],
  display: "flex",
  flexDirection: "column",
  gap: vars.space["6"],
});

export const headingRow = style({
  display: "flex",
  alignItems: "baseline",
  gap: vars.space["3"],
});

export const heading = style({
  fontSize: vars.fontSizes["2xl"],
  fontWeight: vars.fontWeights.bold,
  color: vars.color.textPrimary,
});

export const dailyTotal = style({
  fontSize: vars.fontSizes.md,
  fontWeight: vars.fontWeights.medium,
  color: vars.color.textMuted,
});

export const list = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space["3"],
});

export const emptyState = style({
  padding: vars.space["10"],
  textAlign: "center",
  color: vars.color.textMuted,
  fontSize: vars.fontSizes.md,
  border: `2px dashed ${vars.color.border}`,
  borderRadius: vars.radii.lg,
});

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

export const addButton = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space["2"],
  padding: `${vars.space["2"]} ${vars.space["4"]}`,
  backgroundColor: vars.color.accent,
  color: vars.color.accentText,
  border: "none",
  borderRadius: vars.radii.md,
  fontSize: vars.fontSizes.sm,
  fontWeight: vars.fontWeights.medium,
  cursor: "pointer",
  transition: `background-color ${vars.transitions.fast}`,

  ":hover": {
    backgroundColor: vars.color.accentHover,
  },
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

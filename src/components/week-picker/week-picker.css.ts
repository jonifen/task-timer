import { style } from "@vanilla-extract/css";

import { vars } from "../../theme.css";

export const container = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space["2"],
  padding: `${vars.space["3"]} ${vars.space["4"]}`,
  backgroundColor: vars.color.surface,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const weekNav = style({
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
  width: "32px",
  height: "32px",
  justifyContent: "center",
  borderRadius: vars.radii.md,
  color: vars.color.textSecondary,
  textDecoration: "none",
  fontSize: vars.fontSizes.md,
  transition: `color ${vars.transitions.fast}, background-color ${vars.transitions.fast}`,

  ":hover": {
    color: vars.color.textPrimary,
    backgroundColor: vars.color.surfaceHover,
  },
});

export const days = style({
  display: "flex",
  gap: vars.space["1"],
  flex: 1,
  justifyContent: "center",
});

export const dayLink = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: vars.space["1"],
  padding: `${vars.space["2"]} ${vars.space["3"]}`,
  borderRadius: vars.radii.md,
  textDecoration: "none",
  color: vars.color.textSecondary,
  transition: `color ${vars.transitions.fast}, background-color ${vars.transitions.fast}`,

  ":hover": {
    color: vars.color.textPrimary,
    backgroundColor: vars.color.surfaceHover,
  },
});

export const dayLinkActive = style({
  backgroundColor: vars.color.accent,
  color: vars.color.accentText,

  ":hover": {
    backgroundColor: vars.color.accentHover,
    color: vars.color.accentText,
  },
});

export const dayLinkToday = style({
  fontWeight: vars.fontWeights.semibold,
});

export const dayName = style({
  fontSize: vars.fontSizes.xs,
  lineHeight: 1,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
});

export const dayNumber = style({
  fontSize: vars.fontSizes.md,
  lineHeight: 1,
  fontWeight: vars.fontWeights.medium,
});

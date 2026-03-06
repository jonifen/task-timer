import { style } from "@vanilla-extract/css";

import { vars } from "../theme.css";

export const page = style({
  maxWidth: "640px",
  margin: "0 auto",
  padding: vars.space["6"],
  display: "flex",
  flexDirection: "column",
  gap: vars.space["10"],
});

export const hero = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space["4"],
  paddingTop: vars.space["8"],
});

export const heading = style({
  fontSize: vars.fontSizes["3xl"],
  fontWeight: vars.fontWeights.bold,
  color: vars.color.textPrimary,
  lineHeight: "1.2",
});

export const tagline = style({
  fontSize: vars.fontSizes.lg,
  color: vars.color.textSecondary,
  lineHeight: "1.6",
});

export const featureList = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space["3"],
});

export const sectionHeading = style({
  fontSize: vars.fontSizes.sm,
  fontWeight: vars.fontWeights.semibold,
  color: vars.color.textMuted,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: vars.space["1"],
});

export const featureItem = style({
  display: "flex",
  gap: vars.space["4"],
  padding: vars.space["4"],
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radii.lg,
});

export const featureIcon = style({
  fontSize: "1.25rem",
  flexShrink: 0,
  width: "28px",
  textAlign: "center",
  paddingTop: "1px",
});

export const featureText = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space["1"],
});

export const featureTitle = style({
  fontSize: vars.fontSizes.md,
  fontWeight: vars.fontWeights.semibold,
  color: vars.color.textPrimary,
});

export const featureDesc = style({
  fontSize: vars.fontSizes.sm,
  color: vars.color.textSecondary,
  lineHeight: "1.5",
});

export const ctaRow = style({
  display: "flex",
  gap: vars.space["3"],
  flexWrap: "wrap",
});

export const ctaButton = style({
  display: "inline-flex",
  alignItems: "center",
  gap: vars.space["2"],
  padding: `${vars.space["3"]} ${vars.space["5"]}`,
  borderRadius: vars.radii.md,
  border: "none",
  fontSize: vars.fontSizes.md,
  fontWeight: vars.fontWeights.medium,
  cursor: "pointer",
  textDecoration: "none",
  transition: `background-color ${vars.transitions.fast}`,
});

export const ctaPrimary = style({
  backgroundColor: vars.color.accent,
  color: vars.color.accentText,

  ":hover": {
    backgroundColor: vars.color.accentHover,
  },
});

export const ctaSecondary = style({
  backgroundColor: vars.color.surface,
  color: vars.color.textPrimary,
  border: `1px solid ${vars.color.border}`,

  ":hover": {
    backgroundColor: vars.color.surfaceHover,
  },
});

export const note = style({
  fontSize: vars.fontSizes.sm,
  color: vars.color.textMuted,
  lineHeight: "1.6",
  padding: `${vars.space["4"]} 0`,
  borderTop: `1px solid ${vars.color.border}`,
});

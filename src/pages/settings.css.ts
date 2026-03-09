import { style } from "@vanilla-extract/css";

import { vars } from "../theme.css";

export const page = style({
  maxWidth: "700px",
  margin: "0 auto",
  padding: vars.space["6"],
  display: "flex",
  flexDirection: "column",
  gap: vars.space["6"],
});

export const heading = style({
  fontSize: vars.fontSizes["2xl"],
  fontWeight: vars.fontWeights.bold,
  color: vars.color.textPrimary,
});

export const section = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space["4"],
  padding: vars.space["4"],
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radii.lg,
});

export const sectionHeading = style({
  fontSize: vars.fontSizes.md,
  fontWeight: vars.fontWeights.semibold,
  color: vars.color.textPrimary,
});

export const sectionDescription = style({
  fontSize: vars.fontSizes.sm,
  color: vars.color.textMuted,
  lineHeight: "1.5",
});

export const actions = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space["1"],
});

export const action = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.space["4"],
  padding: `${vars.space["3"]} 0`,
  borderTop: `1px solid ${vars.color.border}`,

  selectors: {
    "&:first-child": {
      borderTop: "none",
    },
  },
});

export const actionText = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space["1"],
  flex: "1",
});

export const actionLabel = style({
  fontSize: vars.fontSizes.sm,
  fontWeight: vars.fontWeights.medium,
  color: vars.color.textPrimary,
});

export const actionHint = style({
  fontSize: vars.fontSizes.sm,
  color: vars.color.textMuted,
});

export const button = style({
  flexShrink: 0,
  padding: `${vars.space["2"]} ${vars.space["4"]}`,
  borderRadius: vars.radii.md,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: "transparent",
  color: vars.color.textSecondary,
  fontSize: vars.fontSizes.sm,
  fontWeight: vars.fontWeights.medium,
  cursor: "pointer",
  whiteSpace: "nowrap",
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

export const buttonDanger = style({
  flexShrink: 0,
  padding: `${vars.space["2"]} ${vars.space["4"]}`,
  borderRadius: vars.radii.md,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: "transparent",
  color: vars.color.textSecondary,
  fontSize: vars.fontSizes.sm,
  fontWeight: vars.fontWeights.medium,
  cursor: "pointer",
  whiteSpace: "nowrap",
  transition: `background-color ${vars.transitions.fast}, color ${vars.transitions.fast}, border-color ${vars.transitions.fast}`,

  ":hover": {
    backgroundColor: vars.color.surfaceHover,
    borderColor: vars.color.danger,
    color: vars.color.danger,
  },

  ":disabled": {
    opacity: 0.5,
    cursor: "default",
  },
});

export const linkButton = style({
  flexShrink: 0,
  display: "inline-block",
  padding: `${vars.space["2"]} ${vars.space["4"]}`,
  borderRadius: vars.radii.md,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: "transparent",
  color: vars.color.textSecondary,
  fontSize: vars.fontSizes.sm,
  fontWeight: vars.fontWeights.medium,
  textDecoration: "none",
  whiteSpace: "nowrap",
  transition: `background-color ${vars.transitions.fast}, color ${vars.transitions.fast}`,

  ":hover": {
    backgroundColor: vars.color.surfaceHover,
    color: vars.color.textPrimary,
  },
});

export const hiddenInput = style({
  display: "none",
});

export const successMessage = style({
  padding: vars.space["3"],
  borderRadius: vars.radii.md,
  border: `1px solid ${vars.color.success}`,
  color: vars.color.success,
  fontSize: vars.fontSizes.sm,
  fontWeight: vars.fontWeights.medium,
});

export const errorMessage = style({
  padding: vars.space["3"],
  borderRadius: vars.radii.md,
  border: `1px solid ${vars.color.danger}`,
  color: vars.color.danger,
  fontSize: vars.fontSizes.sm,
  fontWeight: vars.fontWeights.medium,
});

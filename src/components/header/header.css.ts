import { style } from "@vanilla-extract/css";

import { vars } from "../../theme.css";

export const header = style({
  position: "sticky",
  top: 0,
  zIndex: 100,
  display: "flex",
  alignItems: "center",
  gap: vars.space["8"],
  padding: `0 ${vars.space["6"]}`,
  height: "56px",
  backgroundColor: vars.color.surface,
  borderBottom: `1px solid ${vars.color.border}`,
  boxShadow: vars.shadows.sm,
});

export const title = style({
  fontSize: vars.fontSizes.lg,
  fontWeight: vars.fontWeights.bold,
  color: vars.color.textPrimary,
  textDecoration: "none",
  marginRight: "auto",
});

export const nav = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space["2"],

  "@media": {
    "screen and (max-width: 767px)": {
      gap: vars.space["1"],
    },
  },
});

export const navLink = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space["2"],
  padding: `${vars.space["2"]} ${vars.space["3"]}`,
  borderRadius: vars.radii.md,
  fontSize: vars.fontSizes.sm,
  fontWeight: vars.fontWeights.medium,
  color: vars.color.textSecondary,
  textDecoration: "none",
  transition: `color ${vars.transitions.fast}, background-color ${vars.transitions.fast}`,

  ":hover": {
    color: vars.color.textPrimary,
    backgroundColor: vars.color.surfaceHover,
  },
});

export const navIcon = style({
  display: "flex",
  flexShrink: 0,
});

export const navLabel = style({
  "@media": {
    "screen and (max-width: 767px)": {
      display: "none",
    },
  },
});

export const navLinkActive = style({
  color: vars.color.accent,

  ":hover": {
    color: vars.color.accentHover,
    backgroundColor: vars.color.surfaceHover,
  },
});

export const popOutButton = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  marginLeft: vars.space["2"],
  borderRadius: vars.radii.md,
  border: "none",
  backgroundColor: "transparent",
  color: vars.color.textMuted,
  cursor: "pointer",
  flexShrink: 0,
  transition: `color ${vars.transitions.fast}, background-color ${vars.transitions.fast}`,

  ":hover": {
    color: vars.color.textPrimary,
    backgroundColor: vars.color.surfaceHover,
  },
});

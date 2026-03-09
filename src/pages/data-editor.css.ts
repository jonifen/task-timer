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

export const heading = style({
  fontSize: vars.fontSizes["2xl"],
  fontWeight: vars.fontWeights.bold,
  color: vars.color.textPrimary,
});

export const description = style({
  fontSize: vars.fontSizes.sm,
  color: vars.color.textMuted,
  marginTop: `calc(-1 * ${vars.space["4"]})`,
});

export const message = style({
  padding: vars.space["10"],
  textAlign: "center",
  color: vars.color.textMuted,
  fontSize: vars.fontSizes.md,
  border: `2px dashed ${vars.color.border}`,
  borderRadius: vars.radii.lg,
});

export const group = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space["2"],
  padding: vars.space["4"],
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radii.lg,
});

export const groupHeading = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space["2"],
  fontSize: vars.fontSizes.md,
  fontWeight: vars.fontWeights.semibold,
  color: vars.color.textPrimary,
});

export const groupCount = style({
  fontSize: vars.fontSizes.sm,
  fontWeight: vars.fontWeights.normal,
  color: vars.color.textMuted,
  backgroundColor: vars.color.surfaceHover,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radii.full,
  padding: `1px ${vars.space["2"]}`,
});

export const emptyGroup = style({
  fontSize: vars.fontSizes.sm,
  color: vars.color.textMuted,
  padding: `${vars.space["2"]} 0`,
});

export const list = style({
  display: "flex",
  flexDirection: "column",
  listStyle: "none",
  margin: 0,
  padding: 0,
  borderTop: `1px solid ${vars.color.border}`,
  marginTop: vars.space["1"],
});

export const item = style({
  borderBottom: `1px solid ${vars.color.border}`,
});

export const itemEditing = style({
  backgroundColor: vars.color.surfaceHover,
  borderRadius: vars.radii.md,
  borderBottom: "none",
  marginBottom: vars.space["1"],
});

export const itemButton = style({
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: vars.space["3"],
  padding: `${vars.space["3"]} ${vars.space["2"]}`,
  background: "none",
  border: "none",
  cursor: "pointer",
  textAlign: "left",
  color: vars.color.textPrimary,
  borderRadius: vars.radii.md,

  ":hover": {
    backgroundColor: vars.color.surfaceHover,
  },
});

export const itemLabel = style({
  fontSize: vars.fontSizes.sm,
  fontWeight: vars.fontWeights.medium,
  color: vars.color.textPrimary,
  flex: "1",
});

export const itemKey = style({
  fontSize: vars.fontSizes.xs,
  color: vars.color.textMuted,
  fontFamily: "monospace",
});

export const itemChevron = style({
  fontSize: vars.fontSizes.xs,
  color: vars.color.textMuted,
});

export const editorPanel = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space["3"],
  padding: `0 ${vars.space["2"]} ${vars.space["3"]}`,
});

export const textarea = style({
  width: "100%",
  fontFamily: "monospace",
  fontSize: vars.fontSizes.sm,
  lineHeight: "1.6",
  padding: vars.space["3"],
  borderRadius: vars.radii.md,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.background,
  color: vars.color.textPrimary,
  resize: "vertical",
  boxSizing: "border-box",

  ":focus": {
    outline: `2px solid ${vars.color.accent}`,
    outlineOffset: "1px",
  },
});

export const errorMessage = style({
  padding: vars.space["3"],
  borderRadius: vars.radii.md,
  border: `1px solid ${vars.color.danger}`,
  color: vars.color.danger,
  fontSize: vars.fontSizes.sm,
  fontWeight: vars.fontWeights.medium,
});

export const editorActions = style({
  display: "flex",
  justifyContent: "flex-end",
  gap: vars.space["2"],
});

export const deleteButton = style({
  marginRight: "auto",
  padding: `${vars.space["2"]} ${vars.space["4"]}`,
  borderRadius: vars.radii.md,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: "transparent",
  color: vars.color.textMuted,
  fontSize: vars.fontSizes.sm,
  fontWeight: vars.fontWeights.medium,
  cursor: "pointer",
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

export const cancelButton = style({
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

export const saveButton = style({
  padding: `${vars.space["2"]} ${vars.space["4"]}`,
  borderRadius: vars.radii.md,
  border: `1px solid ${vars.color.accent}`,
  backgroundColor: vars.color.accent,
  color: vars.color.accentText,
  fontSize: vars.fontSizes.sm,
  fontWeight: vars.fontWeights.medium,
  cursor: "pointer",
  transition: `background-color ${vars.transitions.fast}`,

  ":hover": {
    backgroundColor: vars.color.accentHover,
  },

  ":disabled": {
    opacity: 0.5,
    cursor: "default",
  },
});

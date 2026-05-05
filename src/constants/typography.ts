export const fontFamilies = {
  display: "PlusJakartaSans-Bold",
  headline: "PlusJakartaSans-SemiBold",
  title: "PlusJakartaSans-Medium",
  body: "Inter-Regular",
  label: "Inter-Medium",
};

export const typeScale = {
  displayLg: { fontSize: 48, lineHeight: 56, fontFamily: fontFamilies.display, letterSpacing: 0 },
  displayMd: { fontSize: 40, lineHeight: 48, fontFamily: fontFamilies.display, letterSpacing: 0 },
  headlineLg: { fontSize: 30, lineHeight: 36, fontFamily: fontFamilies.display, letterSpacing: 0 },
  headlineMd: { fontSize: 26, lineHeight: 32, fontFamily: fontFamilies.display, letterSpacing: 0 },
  headlineSm: { fontSize: 22, lineHeight: 30, fontFamily: fontFamilies.display, letterSpacing: 0 },
  titleLg: { fontSize: 20, lineHeight: 28, fontFamily: fontFamilies.title, letterSpacing: 0 },
  titleMd: { fontSize: 16, lineHeight: 24, fontFamily: fontFamilies.title, letterSpacing: 0 },
  titleSm: { fontSize: 14, lineHeight: 20, fontFamily: fontFamilies.title, letterSpacing: 0 },
  bodyLg: { fontSize: 16, lineHeight: 24, fontFamily: fontFamilies.body, letterSpacing: 0 },
  bodyMd: { fontSize: 14, lineHeight: 22, fontFamily: fontFamilies.body, letterSpacing: 0 },
  bodySm: { fontSize: 12, lineHeight: 18, fontFamily: fontFamilies.body, letterSpacing: 0 },
  labelLg: { fontSize: 14, lineHeight: 20, fontFamily: fontFamilies.label, letterSpacing: 0 },
  labelMd: { fontSize: 12, lineHeight: 18, fontFamily: fontFamilies.label, letterSpacing: 0 },
  labelSm: { fontSize: 11, lineHeight: 16, fontFamily: fontFamilies.label, letterSpacing: 0 },
};

export const Typography = {
  fontFamily: {
    regular: fontFamilies.body,
    medium: fontFamilies.title,
    semiBold: fontFamilies.headline,
    bold: fontFamilies.display,
  },
  typeScale,
};

export const fontFamilies = {
  display: "PlusJakartaSans-Bold",
  headline: "PlusJakartaSans-SemiBold",
  title: "PlusJakartaSans-Medium",
  body: "Inter-Regular",
  label: "Inter-Medium",
};

export const typeScale = {
  displayLg: { fontSize: 56, fontFamily: fontFamilies.display, letterSpacing: -0.02 * 56 },
  displayMd: { fontSize: 44, fontFamily: fontFamilies.display, letterSpacing: -0.02 * 44 },
  headlineLg: { fontSize: 32, fontFamily: fontFamilies.headline, letterSpacing: -0.02 * 32 },
  headlineMd: { fontSize: 28, fontFamily: fontFamilies.headline, letterSpacing: -0.02 * 28 },
  headlineSm: { fontSize: 24, fontFamily: fontFamilies.headline, letterSpacing: -0.02 * 24 },
  titleLg: { fontSize: 22, fontFamily: fontFamilies.title },
  titleMd: { fontSize: 16, fontFamily: fontFamilies.title },
  titleSm: { fontSize: 14, fontFamily: fontFamilies.title },
  bodyLg: { fontSize: 16, fontFamily: fontFamilies.body },
  bodyMd: { fontSize: 14, fontFamily: fontFamilies.body },
  bodySm: { fontSize: 12, fontFamily: fontFamilies.body },
  labelLg: { fontSize: 14, fontFamily: fontFamilies.label, letterSpacing: 0.1 * 14 },
  labelMd: { fontSize: 12, fontFamily: fontFamilies.label, letterSpacing: 0.1 * 12 },
  labelSm: { fontSize: 11, fontFamily: fontFamilies.label, letterSpacing: 0.1 * 11 },
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

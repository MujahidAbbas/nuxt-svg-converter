export const validateSvg = (svgCode: string): boolean => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgCode, 'image/svg+xml')
  return !doc.querySelector('parsererror')
}

export const formatSvg = (svgCode: string): string => {
  // Basic formatting - you can enhance this
  return svgCode
    .replace(/></g, '>\n<')
    .replace(/\s+/g, ' ')
    .trim()
}

export const optimizeSvg = async (svgCode: string): Promise<string> => {
  // You can integrate SVGO here for optimization
  return svgCode
}

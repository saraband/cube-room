// Transforms an hex color into rgb
// e.g. ('#FF0000') => { r: 255, g: 0, b: 0 }
// Thank you stack overflow
export function hexToRgb (hex) {
  if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    console.error(`${hex} is not a valid color.`)
    return
  }

  let c = hex.substring(1).split('')
  if (c.length === 3) {
    c = [
      c[0], c[0],
      c[1], c[1],
      c[2], c[2],
    ]
  }

  c = '0x' + c.join('')

  return {
    r: (c >> 16) & 255,
    g: (c >> 8) & 255,
    b: c & 255,
  }
}

// Transforms an hex color into rgba string
// e.g. ('#FF0000', 0.5) => 'rgba(255, 0, 0, 0.5)'
export function hexToRgbaString (hex, alpha) {
  const c = hexToRgb(hex)
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`
}
import { NUM_PIXELS_LINE } from 'constants/Pixels'

// Example: index 20 should translate to { x: 0, y: 1 } on a 20x20 canvas
function pixelIndexToCanvasCoords (index) {
  const y = Math.floor(index / NUM_PIXELS_LINE)
  const x = index - (y * NUM_PIXELS_LINE)

  return { x, y }
}

// Draw a pixel on canvas
export function drawPixel ({
  pixelIndex,
  pixelCoords,
  pixelSize,
  pixelColor,
  context,
}) {
  context.fillStyle = pixelColor

  const { x, y } = pixelCoords || pixelIndexToCanvasCoords(pixelIndex)

  context.beginPath()
  context.rect(
    x * pixelSize,
    y * pixelSize,
    pixelSize,
    pixelSize
  )
  context.fill()
}
import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { PixelsColors, NUM_PIXELS_LINE } from 'constants/Pixels'
import Colors from 'constants/Colors'
import Flex from 'components/ui/Flex'
import { drawPixel } from './helpers'

function PixelsVisualizer ({
  pixels,
  size,
  onChange,
  showGuidance,
  editable,
  ...rest
}) {
  const canvasRef = useRef(null)
  const isDrawing = useRef(false)

  const pixelSize = size / NUM_PIXELS_LINE

  const [isGuidanceVisible, setGuidanceVisible] = useState(showGuidance)
  const currentColorKey = useSelector(state => state.currentColorKey)

  // Draw the pixels canvas after first render
  useLayoutEffect(() => {
    if (!canvasRef.current) {
      return
    }

    const pixelsArray = JSON.parse(pixels)

    for (let i = 0; i < pixelsArray.length; ++i) {
      drawPixel({
        pixelIndex: i,
        pixelSize,
        pixelColor: PixelsColors[pixelsArray[i]],
        context: canvasRef.current.getContext('2d'),
      })
    }

  }, [])

  /**
   * Whenever user clicks or drags over the canvas, draw a pixel
   * on the canvas
   */
  const checkPixelActivation = useCallback((event) => {
    const { top, left, width, height } = canvasRef.current.getBoundingClientRect()
    const x = event.clientX - left
    const y = event.clientY - top
    
    // Outside canvas
    if (x < 0 || y < 0 || x > width || y > height) {
      return
    }

    // Convert canvas coords to pixel coords
    const pixelX = Math.floor(x / pixelSize)
    const pixelY = Math.floor(y / pixelSize)

    // Pixel color at given coord is already the right color, do nothing
    const pixelIndex = pixelY * NUM_PIXELS_LINE + pixelX

    if (pixels[pixelIndex] === currentColorKey) {
      return
    }

    // Actually draw pixel on canvas
    drawPixel({
      pixelCoords: {
        x: pixelX,
        y: pixelY,
      },
      pixelSize,
      pixelColor: PixelsColors[currentColorKey],
      context: canvasRef.current.getContext('2d'),
    })

    // Notify pixels change to parent
    const newPixels = [ ...JSON.parse(pixels) ]
    newPixels[pixelIndex] = currentColorKey

    onChange(JSON.stringify(newPixels))
  }, [pixels, onChange])

  // Drag over the canvas handlers
  const onMouseDown = useCallback((event) => {
    isDrawing.current = true

    checkPixelActivation(event)
  }, [checkPixelActivation])

  const onMouseUp = useCallback(() => {
    isDrawing.current = false
  }, [])

  const onMouseMove = useCallback((event) => {
    if (!isDrawing.current || !canvasRef.current) {
      return
    }

    checkPixelActivation(event)
  }, [checkPixelActivation])

  // Bind canvas event handlers
  useEffect(() => {
    if (!editable) {
      return
    }
  
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [onMouseDown, onMouseUp])

  return (
    <Container crosshair={editable} {...rest}>
      {isGuidanceVisible &&
        <GuidanceOverlay onMouseDown={() => setGuidanceVisible(false)}>
          Draw here the room of your dreams 🚢
        </GuidanceOverlay>
      }
      <StyledCanvas
        width={size}
        height={size}
        ref={canvasRef}
        onMouseMove={editable ? onMouseMove : undefined}
      />
    </Container>
  )
}

PixelsVisualizer.propTypes = {
  pixels: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  editable: PropTypes.bool,
  showGuidance: PropTypes.bool,
}

PixelsVisualizer.defaultProps = {
  showGuidance: false,
  editable: false,
}

const StyledCanvas = styled.canvas`
  border-radius: 4px;
  width: ${p => p.size}px;
  height: ${p => p.size}px;
`

const Container = styled(Flex)`
  position: relative;
  display: inline-block;
  cursor: ${p => p.crosshair ? 'crosshair' : 'auto'};
  border-radius: 4px;
`

const GuidanceOverlay = styled(Flex).attrs(() => ({
  justifyCenter: true,
  itemsCenter: true,
}))`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 116, 217, 0.05);
  color: ${Colors.DARK_BLUE};
  padding: 32px;
  text-align: center;
  border-radius: 4px;
`

export default PixelsVisualizer
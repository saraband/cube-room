import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
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
  function checkPixelActivation (event) {
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

    drawPixel({
      pixelCoords: {
        x: pixelX,
        y: pixelY,
      },
      pixelSize,
      pixelColor: PixelsColors[currentColorKey],
      context: canvasRef.current.getContext('2d'),
    })

    const newPixels = [...JSON.parse(pixels)]
    newPixels[pixelY * NUM_PIXELS_LINE + pixelX] = currentColorKey

    onChange(JSON.stringify(newPixels))
  }

  // Drag over the canvas handlers
  function onMouseDown (event) {
    isDrawing.current = true

    checkPixelActivation(event)
  }

  function onMouseUp () {
    isDrawing.current = false
  }

  function onMouseMove (event) {
    if (!isDrawing.current || !canvasRef.current) {
      return
    }

    checkPixelActivation(event)
  }

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
  }, [])

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
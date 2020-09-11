import React from 'react'
import styled from 'styled-components'
import Flex from 'components/ui/Flex'
import { useSelector, useDispatch } from 'react-redux'
import { SET_CURRENT_COLOR_KEY } from 'store'
import { PixelsColors } from 'constants/Pixels'

function ColorPicker (props) {
  const currentColorKey = useSelector(state => state.currentColorKey)
  const dispatch = useDispatch()

  function setCurrentColorKey (colorKey) {
    dispatch({
      type: SET_CURRENT_COLOR_KEY,
      colorKey,
    })
  }
  
  return (
    <Container {...props}>
      {PixelsColors.map((hex, index) => (
        <ColorOption 
          key={hex} 
          color={hex}
          selected={index === currentColorKey}
          onClick={() => setCurrentColorKey(index)}
        />
      ))}
    </Container>
  )
}

const Container = styled(Flex)`
  flex-wrap: wrap;
  border-radius: 4px;
  overflow: hidden;
`

const ColorOption = styled.div`
  width: 25%;
  height: 32px;
  background-color: ${props => props.color};
  cursor: pointer;
  transition: all 0.15s ease;
  opacity: ${props => props.selected ? 1 : 0.6};

  &:hover {
    opacity: 1;
  }
`

export default ColorPicker

import React from 'react'
import styled, { keyframes } from 'styled-components'
import Colors from 'constants/Colors'
import PropTypes from 'prop-types'
import Flex from 'components/ui/Flex'

function BaseLoader ({
  color,
  size,
  numBlocks,
  animationDuration,
  ...rest
}) {

  const blockSize = 100 / (numBlocks * 2 - 1)
  const animationDelay = animationDuration / numBlocks

  return (
    <Container size={size} {...rest}>
      {new Array(numBlocks).fill(1).map((_, index) => (
        <Block
          size={blockSize}
          color={color}
          key={index}
          animationDuration={animationDuration}
          delay={animationDelay * index / 2}
        />
      ))}
    </Container>
  )
}

BaseLoader.propTypes = {
  size: PropTypes.number,
  numBlocks: PropTypes.number,
  animationDuration: PropTypes.number,
  color: PropTypes.string,
}

BaseLoader.defaultProps = {
  size: 200,
  numBlocks: 3,
  animationDuration: 1,
  color: Colors.BLUE,
}

const BlockAnimation = keyframes`
  from {
    margin-left: -101%;
  } to {
    margin-left: 101%;
  }
`

const Container = styled(Flex).attrs(() => ({
  col: true,
  justifyBetween: true,
}))`
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  position: relative;
  overflow: hidden;
`

const Block = styled.div`
  background-color: ${p => p.color};
  width: 100%;
  height: ${p => p.size}%;
  animation: ${BlockAnimation} ${p => p.animationDuration}s infinite ease-in-out;
  animation-delay: ${p => p.delay}s;
  margin-left: -101%;
`

export default BaseLoader
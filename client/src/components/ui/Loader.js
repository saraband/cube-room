import styled, { keyframes } from 'styled-components'
import PropTypes from 'prop-types'
import Colors from 'constants/Colors'

const Rotate = keyframes`
  from {
    transform: rotate(0deg);
  } to {
    transform: rotate(360deg);
  }
`

const Loader = styled.div`
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  border-radius: 100%;
  border: ${p => Math.ceil(p.size / 10)}px solid ${Colors.PRIMARY};
  clip-path: polygon(0 0, 100% 0, 100% 50%, 50% 50%, 50% 100%, 0 100%);
  animation: ${Rotate} 0.5s linear infinite;
`

Loader.propTypes = {
  size: PropTypes.number,
}

Loader.defaultp = {
  size: 16,
}

export default Loader
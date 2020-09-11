import styled from 'styled-components'
import PropTypes from 'prop-types'

const Flex = styled.div`
  display: flex;
  flex-direction: ${props => props.col ? 'column' : 'row'};
  justify-content: ${props => {
    if (props.justifyCenter) return 'center'
    if (props.justifyEnd) return 'end'
    if (props.justifyBetween) return 'space-between'
  }};
  align-items: ${props => props.itemsCenter ? 'center' : ''};
`

Flex.propTypes = {
  col: PropTypes.bool,
  justifyCenter: PropTypes.bool,
  justifyEnd: PropTypes.bool,
  justifyBetween: PropTypes.bool,
  itemsCenter: PropTypes.bool,
}

Flex.defaultProps = {
}

export default Flex
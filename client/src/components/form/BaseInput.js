import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import Colors from 'constants/Colors'
import { hexToRgbaString } from 'helpers/Color'
import connectToBaseForm from './connectToBaseForm'

const BLUE_TRANSPARENT = hexToRgbaString(Colors.LIGHT_BLUE, 0.2)
const RED_TRANSPARENT = hexToRgbaString(Colors.RED, 0.2)

export const GenericInputStyle = css`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid ${p => p.error ? Colors.RED : Colors.GREY};
  box-shadow: 0 0 0 3px ${hexToRgbaString(Colors.LIGHT_BLUE, 0)};
  transition: all 0.3s ease;

  &:focus:not(:disabled),
  &:active:not(:disabled) {
    outline: 0;
    border: 1px solid ${Colors.SECONDARY};
    box-shadow: 0 0 0 3px ${p => p.error ? RED_TRANSPARENT : BLUE_TRANSPARENT};
  }
`

const BaseInput = styled.input`
  width: ${p => p.fullWidth ? '100%' : 'auto'};
  ${GenericInputStyle}
`

BaseInput.propTypes = {
  type: PropTypes.string.isRequired,
  fullWidth: PropTypes.bool,
}

BaseInput.defaultProps = {
  type: 'text',
}

export default connectToBaseForm(BaseInput)
import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { useFormikContext } from 'formik'
import { GenericInputStyle } from './BaseInput'

const StyledTextarea = styled.textarea`
  resize: none;
  height: 100px;;
  ${GenericInputStyle}
`

function BaseTextarea ({ onChange, name, ...rest }) {
  const context = useFormikContext()

  function handleChange ({ target: { value }}) {
    onChange && onChange(value)

    if (context) {
      context.setFieldValue(name, value)
    }
  }

  return (
    <StyledTextarea
      onChange={handleChange}
      name={name}
      {...rest}
    />
  )
}

BaseTextarea.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
}

BaseTextarea.defaultProps = {
}

export default BaseTextarea
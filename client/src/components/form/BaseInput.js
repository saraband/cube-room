import React from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import { useFormikContext, ErrorMessage } from 'formik'
import Colors from 'constants/Colors'

function BaseInput ({
  name,
  onChange,
  className,
  fullWidth,
  showErrorMessage,
  value,
  ...rest
}) {
  const context = useFormikContext()
  const finalValue = context
    ? context.values[name]
    : value

  function handleChange ({ target: { value }}) {
    onChange && onChange(value)

    if (context) {
      context.setFieldValue(name, value)
    }
  }

  return (
    <Container
      className={className}
      fullWidth={fullWidth}
    >
      <StyledInput
        name={name}
        value={finalValue}
        onChange={handleChange}
        error={context?.errors[name]}
        {...rest}
      />
      {context && showErrorMessage && 
        <ErrorMessage name={name}>
          {(message) => <Error>{message}</Error>}
        </ErrorMessage>
      } 
    </Container>
  )
}

BaseInput.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  showErrorMessage: PropTypes.bool,
}

BaseInput.defaultProps = {
  type: 'text',
  showErrorMessage: false,
}

export const GenericInputStyle = css`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid ${p => p.error ? Colors.RED : Colors.GREY};
  box-shadow: 0 0 0 3px rgba(0, 116, 217, 0);
  transition: all 0.3s ease;

  &:focus:not(:disabled),
  &:active:not(:disabled) {
    outline: 0;
    border: 1px solid ${Colors.SECONDARY};
    box-shadow: 0 0 0 3px rgba(0, 116, 217, 0.2);
  }
`

const StyledInput = styled.input`
  width: 100%;
  ${GenericInputStyle}
`

const Container = styled.div`
  width: ${p => p.fullWidth ? '100%' : 'auto'};
`

const Error = styled.div`
  font-size: 0.8rem;
  color: ${Colors.RED};
  margin-top: 4px;
`

export default BaseInput
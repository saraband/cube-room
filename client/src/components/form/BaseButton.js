import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Colors from 'constants/Colors'
import BaseLoader from 'components/ui/BaseLoader'
import Flex from 'components/ui/Flex'

function BaseButton ({
  children,
  loading,
  disabled,
  ...rest
}) {
  return (
    <StyledButton
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <StyledLoader/>}
      {children}
    </StyledButton>
  )
}

BaseButton.propTypes = {
  fullWidth: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
}

BaseButton.defaultProps = {
  fullWidth: false,
}

const StyledButton = styled(Flex).attrs(() => ({
  as: 'button',
  justifyCenter: true,
  itemsCenter: true,
}))`
  padding: 8px 16px;
  border-radius: 4px;
  border: 0;
  background-color: ${Colors.BLUE};
  box-shadow: 0 0 0 3px rgba(0, 116, 217, 0);
  transition: all 0.15s ease;
  color: ${Colors.WHITE};
  cursor: pointer;
  width: ${p => p.fullWidth ? '100%' : 'auto'};

  &:disabled {
    opacity: 0.4;
    filter: grayscale(1);
    cursor: not-allowed
  }

  &:hover:not(:disabled) {
    background-color: ${Colors.LIGHT_BLUE};
  }

  &:focus:not(:disabled),
  &:active:not(:disabled) {
    outline: 0;
    border: 1px solid ${Colors.SECONDARY};
    box-shadow: 0 0 0 3px rgba(0, 116, 217, 0.2);
  }
`

const StyledLoader = styled(BaseLoader).attrs(() => ({
  color: Colors.WHITE,
  size: 12,
}))`
  margin-right: 8px;
`

export default BaseButton
import React, { useContext } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Colors from 'constants/Colors'
import BaseLoader from 'components/ui/BaseLoader'
import Flex from 'components/ui/Flex'
import { BaseFormContext } from './BaseForm'

function BaseButton ({
  children,
  loading,
  disabled,
  icon,
  ...rest
}) {
  const context = useContext(BaseFormContext)
  const inForm = !!context && Object.keys(context).length
  const isLoading = loading || !!(inForm && context.isSubmitting)

  return (
    <StyledButton
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && <StyledLoader/>}
      {!isLoading && icon && <Icon src={icon}/>}
      {children}
    </StyledButton>
  )
}

BaseButton.propTypes = {
  fullWidth: PropTypes.bool,
  children: PropTypes.node,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.string,
}

BaseButton.defaultProps = {
  fullWidth: false,
}

const Icon = styled.img`
  margin-right: 8px;
`

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
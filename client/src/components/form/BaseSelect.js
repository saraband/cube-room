/* eslint-disable */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { GenericInputStyle } from './BaseInput'
import connectToBaseForm from './connectToBaseForm'
import Colors from 'constants/Colors'
import ChevronDownSrc from 'assets/icons/chevron-down.svg'

function BaseSelect ({
  defaultLabel,
  children,
  name,
  value,
  onChange,
  ...rest
}) {
  const dropdownRef = useRef(null)
  const toggleRef = useRef(null)
  const [isDropdownVisible, setDropdownVisible] = useState(false)
  const options = children

  // Close dropdown when user clicks outside of it
  useEffect(() => {
    function closeDropdown (event) {
      if (!toggleRef.current ||
        !dropdownRef.current ||
        toggleRef.current === event.target ||
        toggleRef.current.contains(event.target) ||
        dropdownRef.current === event.target ||
        dropdownRef.current.contains(event.target)) {
        return
      }

      setDropdownVisible(false)
    }

    document.addEventListener('click', closeDropdown)
  
    return () => {
      document.removeEventListener('click', closeDropdown)
    }
  }, [])

  // Determine label for current value
  const currentValueLabel = (options.find((opt) => opt.value === value) || {}).label

  function handleSelectOption (optionValue) {
    onChange && onChange({
      target: {
        name,
        value: optionValue,
      }
    })
    setDropdownVisible(false)
  }

  return (
    <Container {...rest}>
      <Toggle
        ref={toggleRef}
        onClick={() => setDropdownVisible(!isDropdownVisible)}
        onKeyPress={({ key }) => key === 'Enter' && setDropdownVisible(!isDropdownVisible)}
      >
        <ToggleIcon open={isDropdownVisible}/>
        {currentValueLabel
          ? <Label>{currentValueLabel}</Label>
          : <DefaultLabel>{defaultLabel}</DefaultLabel>
        }
      </Toggle>
      <Dropdown
        ref={dropdownRef}
        visible={isDropdownVisible}
      >
        {options.map(({ value, label }) => (
          <Option
            key={value}
            onClick={() => handleSelectOption(value)}
          >
            {label}
          </Option>
        ))}
      </Dropdown>
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  display: inline-block;
`

const Option = styled.div`
  cursor: pointer;
  user-select: none;
  padding: 8px;
  transition: all 0.15s ease;

  &:not(:last-child) {
    border-bottom: 1px solid ${Colors.GREY};
  }

  &:hover {
    background-color: rgba(0, 116, 217, 0.05);
    color: ${Colors.BLUE};
  }
`

const Toggle = styled.div.attrs(() => ({
  tabIndex: 0,
}))`
  ${GenericInputStyle}
  min-width: 150px;
  cursor: pointer;
  position: relative;
  padding-right: 32px;
`

const Dropdown = styled.div`
  position: absolute;
  width: 100%;
  top: 100%;
  left: 0;
  margin-top: ${p => p.visible ? '8px' : '32px'};
  opacity: ${p => p.visible ? 1 : 0};
  z-index: ${p => p.visible ? 100 : -1};
  border-radius: 4px;
  border: 1px solid ${Colors.GREY};
  background-color: white;
  transition: all 0.2s ease;
  box-shadow: 1px 2px 10px 0px rgba(0, 0, 0, 0.1)
`

const DefaultLabel = styled.label`
  color: ${Colors.GREY};
  cursor: pointer;
  user-select: none;
`

const Label = styled(DefaultLabel)`
  color: ${Colors.BLACK};
`

const ToggleIcon = styled.img.attrs(() => ({
  src: ChevronDownSrc,
}))`
  position: absolute;
  top: 11px;
  right: 0;
  margin-right: 8px;
  transition: all 0.2s ease;
  transform: rotate(${p => p.open ? '180deg' : '0deg'});
`


export default connectToBaseForm(BaseSelect)
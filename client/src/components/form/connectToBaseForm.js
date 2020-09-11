import React, { useContext } from 'react'
import { BaseFormContext } from './BaseForm'
import PropTypes from 'prop-types'

/**
 * HOC to wrap form components and make them connect
 * with their form (Access to validation, error, loading state)
 */
export default function connectToBaseForm (Component) {
  function ResultComponent (props) {
    const context = useContext(BaseFormContext)
    const inForm = !!context && Object.keys(context).length

    // Not inside a form, return the same component
    if (!inForm || !props.name) {
      return <Component {...props}/>
    }

    const {
      name,
      onChange,
    } = props

    function handleChange ({ target: { value }}) {
      onChange && onChange(value)

      if (context) {
        context.setFieldValue(name, value)
      }
    }

    return (
      <Component
        {...props}
        value={context.values[name]}
        error={context.errors[name]}
        onChange={handleChange}
        disabled={context.isSubmitting}
      />
    )
  }

  ResultComponent.propTypes = {
    name: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,
  }

  return ResultComponent
}
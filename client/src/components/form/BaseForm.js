import React from 'react'
import PropTypes from 'prop-types'
import { Formik, Form } from 'formik'

export const BaseFormContext = React.createContext({})

function BaseForm ({ children, className, ...rest }) {
  return (
    <Formik {...rest}>
      {(formikContext) => (
        <Form className={className}>
          <BaseFormContext.Provider value={formikContext}>
            {
              typeof children === 'function'
                ? children(formikContext)
                : children
            }
          </BaseFormContext.Provider>
        </Form>
      )}
    </Formik>
  )
}

BaseForm.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  className: PropTypes.string,
}

export default BaseForm
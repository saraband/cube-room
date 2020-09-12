import styled from 'styled-components'
import { GenericInputStyle } from './BaseInput'
import connectToBaseForm from './connectToBaseForm'

const BaseTextarea = styled.textarea`
  resize: none;
  height: 90px;
  ${GenericInputStyle}
`

export default connectToBaseForm(BaseTextarea)
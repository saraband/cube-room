import styled from 'styled-components'
import { GenericInputStyle } from './BaseInput'
import connectToBaseForm from './connectToBaseForm'

const BaseTextarea = styled.textarea`
  resize: none;
  height: 100px;
  ${GenericInputStyle}
`

export default connectToBaseForm(BaseTextarea)
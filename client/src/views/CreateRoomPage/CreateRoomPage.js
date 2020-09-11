import React from 'react'
import PixelsVisualizer from 'components/PixelsVisualizer/PixelsVisualizer'
import styled from 'styled-components'
import { Field } from 'formik'
import { gql, useMutation } from '@apollo/client'
import Colors from 'constants/Colors'
import { useHistory } from 'react-router-dom'
import Routes, { generateRoute } from 'constants/Routes'
import BaseInput from 'components/form/BaseInput'
import BaseTextarea from 'components/form/BaseTextarea'
import Flex from 'components/ui/Flex'
import BaseButton from 'components/form/BaseButton'
import ColorPicker from './ColorPicker'
import * as Yup from 'yup'
import BaseForm from 'components/form/BaseForm'
import Layout from 'components/ui/Layout'
import useTitle from 'helpers/useTitle'

const CREATE_ROOM = gql`
  mutation CreateRoom($input: CreateRoomInput!) {
    createRoom(input: $input) {
      id
      name
      description
    }
  }
`

const CreateRoomSchema = Yup.object().shape({
  name: Yup.string().required('This field is required'),
})

const BLANK_ROOM_PIXELS = JSON.stringify(new Array(400).fill(15))

function CreateRoom () {
  useTitle('Cube-room | Create a new room')
  const history = useHistory()
  const [createRoom] = useMutation(CREATE_ROOM)

  return (
    <Layout title="Create a room" itemsCenter>
      <StyledForm
        validateOnChange={false}
        initialValues={{
          name: '',
          description: '',
          pixels: BLANK_ROOM_PIXELS,
        }}
        validationSchema={CreateRoomSchema}
        onSubmit={async (values) => {
          try {
            const { data } = await createRoom({
              variables: {
                input: values,
              },
            })

            history.push(generateRoute(Routes.ROOM, { roomId: data.createRoom.id }))
          } catch (error) {
            console.error(error)
          }
        }}
      >
        <Left>
          <ColorPicker/>
          <BaseInput
            name="name"
            placeholder="Name"
          />
          <BaseTextarea
            name="description"
            placeholder="Description"
          />
          <SubmitButton>
            Create room
          </SubmitButton>
        </Left>
        <Field name="pixels">
          {({ field: { value }, form: { setFieldValue } }) => (
            <StyledPixelsVisualizer
              size={400}
              pixels={value}
              editable
              showGuidance
              onChange={(pixels) => setFieldValue('pixels', pixels)}
            />
          )}
        </Field>
      </StyledForm>
    </Layout>
  )
}

const StyledForm = styled(BaseForm)`
  display: flex;
`

const Left = styled(Flex).attrs(() => ({
  col: true,
}))`
  margin-right: 16px;
  > *:not(:last-child) {
    margin-bottom: 16px;
  }
`

const SubmitButton = styled(BaseButton).attrs(() => ({
  type: 'submit',
  fullWidth: true,
}))`
  align-self: flex-end;
`

const StyledPixelsVisualizer = styled(PixelsVisualizer)`
  border: 1px solid ${Colors.GREY};
  border-radius: 4px;
`

export default CreateRoom

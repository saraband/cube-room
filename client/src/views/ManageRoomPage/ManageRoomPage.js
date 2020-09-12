/* eslint-disable */


import React from 'react'
import PixelsVisualizer from 'components/PixelsVisualizer/PixelsVisualizer'
import styled from 'styled-components'
import { Field } from 'formik'
import { gql, useMutation, useQuery } from '@apollo/client'
import Colors from 'constants/Colors'
import { useHistory, useParams } from 'react-router-dom'
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
import WandSrc from 'assets/icons/wand.svg'
import BaseLoader from 'components/ui/BaseLoader'

const CREATE_ROOM = gql`
  mutation CreateRoom($input: CreateRoomInput!) {
    manageRoom: createRoom(input: $input) {
      token
      room {
        id
      }
    }
  }
`

const EDIT_ROOM = gql`
  mutation EditRoom($input: EditRoomInput!) {
    manageRoom: editRoom(input: $input) {
      room {
        id
      }
    }
  }
`

const GET_ROOM = gql`
  query GetRoom($roomId: ID!) {
    room(roomId: $roomId) {
      id
      name
      description
      pixels
    }
  }
`

const CreateRoomSchema = Yup.object().shape({
  name: Yup.string().required('This field is required'),
  password: Yup.string().required('This field is required'),
})

const EditRoomSchema = Yup.object().shape({
  name: Yup.string().required('This field is required'),
})

const BLANK_ROOM_PIXELS = JSON.stringify(new Array(400).fill(15))

function EditRoomLoader () {
  return (
    <StyledEditRoomLoader>
      <BaseLoader size={50}/>
    </StyledEditRoomLoader>
  )
}


function ManageRoom ({ action }) {
  const isEdit = action === 'edit'
  const isCreate = !isEdit

  const cta = isEdit ? 'Edit room' : 'Create a room'
  useTitle(`Cube-room | ${cta}`)

  const history = useHistory()
  const { roomId } = useParams()
  const [manageRoom] = useMutation(isEdit ? EDIT_ROOM : CREATE_ROOM)

  // Room info for edit page
  const { loading, data } = useQuery(GET_ROOM, {
    variables: {
      roomId,
    },
    skip: isCreate,
  })

  const validationSchema = isEdit ? EditRoomSchema : CreateRoomSchema
  let formInitialValues = {
    name: '',
    description: '',
    pixels: BLANK_ROOM_PIXELS,
    password: ''
  }

  if (isEdit && data) {
    const { room } = data

    formInitialValues.name = room.name
    formInitialValues.description = room.description
    formInitialValues.pixels = room.pixels
    delete formInitialValues.password
  }

  return (
    <Layout title={cta} itemsCenter>
      {loading && <EditRoomLoader/>}
      {!loading && 
        <StyledForm
          validateOnChange={false}
          initialValues={formInitialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              const variables = {
                input: values,
              }

              if (isEdit) {
                variables.input.roomId = roomId
              }

              const { data } = await manageRoom({ variables })

              // Creating a room grants direct edit scope access to it
              // Update local token
              if (isCreate) {
                localStorage.setItem('token', data.manageRoom.token)
              }

              // Redirect to room after either creation or edit
              history.push(generateRoute(Routes.ROOM, { roomId: data.manageRoom.room.id }))
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
            {isCreate &&
              <BaseInput
                name="password"
                placeholder="Room edit password"
              />
            }
            <BaseTextarea
              name="description"
              placeholder="Description"
            />
            <SubmitButton>
              {cta}
            </SubmitButton>
          </Left>
          <Field name="pixels">
            {({ field: { value }, form: { setFieldValue } }) => (
              <StyledPixelsVisualizer
                size={400}
                pixels={value}
                editable
                showGuidance={isCreate}
                onChange={(pixels) => setFieldValue('pixels', pixels)}
              />
            )}
          </Field>
        </StyledForm>
      }
    </Layout>
  )
}

const StyledEditRoomLoader = styled(Flex).attrs(() => ({
  justifyCenter: true,
  itemsCenter: true,
}))`
  flex-grow: 1;
`

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
  icon: WandSrc,
}))`
  align-self: flex-end;
`

const StyledPixelsVisualizer = styled(PixelsVisualizer)`
  border: 1px solid ${Colors.GREY};
  border-radius: 4px;
`

export default ManageRoom

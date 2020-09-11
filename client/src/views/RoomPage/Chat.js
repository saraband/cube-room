import React, { useLayoutEffect, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import Flex from 'components/ui/Flex'
import BaseLoader from 'components/ui/BaseLoader'
import BaseInput from 'components/form/BaseInput'
import Colors from 'constants/Colors'
import { gql, useMutation, useQuery } from '@apollo/client'
import ChatMessage from './ChatMessage'
import Faker from 'faker/locale/en'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

const SEND_CHAT_MESSAGE = gql`
  mutation SendChatMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
    }
  }
`

const GET_ROOM = gql`
  query GetRoomMessages($roomId: ID!) {
    room(roomId: $roomId) {
      id
      messages {
        id
        username
        content
        createdAt
      }
    }
  }
`

const ON_MESSAGE_RECEIVED = gql`
  subscription OnMessageReceived($roomId: ID!) {
    messageReceived(roomId: $roomId) {
      id
      username
      content
    }
  }
`

function ChatLoader () {
  return (
    <StyledChatLoader>
      <BaseLoader size={50}/>
    </StyledChatLoader>
  )
}

const SendChatMessageSchema = Yup.object().shape({
  username: Yup.string().required('This field is required'),
  message: Yup.string().required('This field is required'),
})

function Chat () {
  const chatContainerRef = useRef(null)
  const [sendChatMessage] = useMutation(SEND_CHAT_MESSAGE)

  const { roomId } = useParams()
  const { loading, data, subscribeToMore } = useQuery(GET_ROOM, {
    fetchPolicy: 'cache-and-network',
    variables: {
      roomId,
    },
  })

  // Subscribe to messages sent in this room
  useEffect(() => {
    subscribeToMore({
      document: ON_MESSAGE_RECEIVED,
      variables: {
        roomId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        return {
          ...prev,
          room: {
            ...prev.room,
            messages: [
              ...prev.room.messages,
              subscriptionData.data.messageReceived,
            ],
          },
        }
      },
    })
  }, [])

  // Scroll to latest message when receiving one
  useLayoutEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo(0, chatContainerRef.current.scrollHeight)
    }
  }, [data])

  async function submitChatMessage ({ values: { username, message }, setFieldValue }) {
    try {
      await sendChatMessage({
        variables: {
          input: {
            roomId,
            username,
            content: message,
          },
        },
      })

      // Reset message input
      setFieldValue('message', '')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Container>
      {/* Messages list */}
      <MessagesContainer ref={chatContainerRef}>
        {loading
          ? <ChatLoader/>
          : data.room.messages.map((message) => <ChatMessage key={message.id} {...message}/>)
        }
      </MessagesContainer>

      {/* Send message form */}
      <Formik
        initialValues={{
          username: Faker.name.firstName(),
          message: '',
        }}
        validationSchema={SendChatMessageSchema}
        onSubmit={submitChatMessage}
      >
        {({ isSubmitting, errors, ...formAttrs }) => (
          <ChatMessageForm>
            <UsernameInput disabled={isSubmitting}/>
            <ChatMessageInput
              disabled={isSubmitting}
              onKeyDown={({ key }) => {
                if (key === 'Enter' && !Object.keys(errors).length) {
                  submitChatMessage(formAttrs)
                }
              }}
            />
          </ChatMessageForm>
        )}
      </Formik>
    </Container>
  )
}

const Container = styled(Flex).attrs(() => ({
  col: true,
}))`
  padding: 16px;
  height: 500px;
  position: relative;
  border: 1px solid ${Colors.GREY};
  border-radius: 4px;
`

const ChatMessageInput = styled(BaseInput).attrs(() => ({
  fullWidth: true,
  name: 'message',
  placeholder: 'Say hi',
}))`
  flex-grow: 1;
  margin-left: 16px;
`

const MessagesContainer = styled(Flex).attrs(() => ({
  col: true,
}))`
  width: 400px;
  overflow-y: auto;
  background-color: rgba(0, 116, 217, 0.05);
  border-radius: 4px;
  flex-grow: 1;
  padding: 16px;
`

const ChatMessageForm = styled(Form)`
  display: flex;
  align-items: center;
  margin-top: 16px;
`

const UsernameInput = styled(BaseInput).attrs(() => ({
  placeholder: 'Username',
  name: 'username',
}))`
  width: 100px;
  flex-shrink: 0;
`

const StyledChatLoader = styled(Flex).attrs(() => ({
  justifyCenter: true,
  itemsCenter: true,
}))`
  flex-grow: 1;
`

export default Chat
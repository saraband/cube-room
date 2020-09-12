import React from 'react'
import { useParams } from 'react-router-dom'
import { gql, useQuery, useMutation } from '@apollo/client'
import Layout from 'components/ui/Layout'
import styled from 'styled-components'
import Flex from 'components/ui/Flex'
import Chat from './Chat'
import PixelsVisualizer from 'components/PixelsVisualizer/PixelsVisualizer'
import BaseLoader from 'components/ui/BaseLoader'
import useTitle from 'helpers/useTitle'

const GET_ROOM_INFO = gql`
  query GetRoomInfo($roomId: ID!) {
    room(roomId: $roomId) {
      id
      name
      pixels
      hasEditScope
    }
  }
`

const UNLOCK_ROOM = gql`
  mutation UnlockRoom($roomId: ID!, $password: String!) {
    unlockRoom(roomId: $roomId, password: $password) {
      token
      room {
        id
        hasEditScope
      }
    }
  }
`

function RoomLoader () {
  return (
    <StyledRoomLoader>
      <BaseLoader size={50}/>
    </StyledRoomLoader>
  )
}


function Room () {
  const { roomId } = useParams()
  const { loading, data } = useQuery(GET_ROOM_INFO, {
    variables: {
      roomId,
    },
  })

  const room = data?.room || {}

  useTitle(`Cube-room | ${room.name || 'Loading room...'}`, [room.name])

  const [password, setPassword] = React.useState('')
  const [unlockRoom] = useMutation(UNLOCK_ROOM)

  return (
    <Layout title={room.name}>
      <h1>has edit scope: {room.hasEditScope ? 'yes' : 'false'}</h1>
      <Flex>
        <input value={password} onChange={(e) => setPassword(e.target.value)}/>
        <button onClick={async () => {
          try {
            const { data } = await unlockRoom({ variables: { roomId, password } })
            console.error('success ', data)
          } catch (err) {
            console.error(err)
          }
        }}>unlock</button>
      </Flex>
      {loading
        ? <RoomLoader/>
        : (
          <Container>
            <StyledPixelsVisualizer pixels={room.pixels}/>
            <Chat/>
          </Container>
        )
      }
    </Layout>
  )
}


const Container = styled(Flex).attrs(() => ({
  justifyCenter: true,
}))`
  flex-grow: 1;
`

const StyledPixelsVisualizer = styled(PixelsVisualizer).attrs(() => ({
  size: 500,
}))`
  margin-right: 16px;
`

const StyledRoomLoader = styled(Flex).attrs(() => ({
  justifyCenter: true,
  itemsCenter: true,
}))`
  flex-grow: 1;
`

export default Room

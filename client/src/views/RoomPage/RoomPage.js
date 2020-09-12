import React from 'react'
import { useParams } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'
import Layout from 'components/ui/Layout'
import styled from 'styled-components'
import Flex from 'components/ui/Flex'
import Chat from './Chat'
import PixelsVisualizer from 'components/PixelsVisualizer/PixelsVisualizer'
import BaseLoader from 'components/ui/BaseLoader'
import useTitle from 'helpers/useTitle'
import { UnlockRoomButton, EditRoomButton } from './RoomActionButtons'

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
    fetchPolicy: 'cache-and-network',
    variables: {
      roomId,
    },
  })

  const room = data?.room || {}

  useTitle(`Cube-room | ${room.name || 'Loading room...'}`, [room.name])

  return (
    <Layout title={room.name}>
      {loading
        ? <RoomLoader/>
        : (
          <Container>
            <PixelsContainer>
              {!room.hasEditScope ? <UnlockRoomButton roomId={roomId} /> : <EditRoomButton roomId={roomId}/>}
              <PixelsVisualizer
                size={500}
                pixels={room.pixels}
              />
            </PixelsContainer>
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

const PixelsContainer = styled.div`
  margin-right: 16px;
  position: relative;
`

const StyledRoomLoader = styled(Flex).attrs(() => ({
  justifyCenter: true,
  itemsCenter: true,
}))`
  flex-grow: 1;
`

export default Room

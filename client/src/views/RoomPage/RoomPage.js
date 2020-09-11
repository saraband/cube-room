import React from 'react'
import { useParams } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'
import Layout from 'components/ui/Layout'
import styled from 'styled-components'
import Flex from 'components/ui/Flex'
import Chat from './Chat'
import PixelsVisualizer from 'components/PixelsVisualizer/PixelsVisualizer'
import BaseLoader from 'components/ui/BaseLoader'

const GET_ROOM_INFO = gql`
  query GetRoomInfo($roomId: ID!) {
    room(roomId: $roomId) {
      id
      name
      pixels
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

  return (
    <Layout title={room.name}>
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

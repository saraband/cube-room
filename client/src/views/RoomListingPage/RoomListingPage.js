import React, { useState, useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import RoomThumbnailLink from './RoomThumbnailLink'
import Layout from 'components/ui/Layout'
import BaseLoader from 'components/ui/BaseLoader'
import Flex from 'components/ui/Flex'
import BaseButton from 'components/form/BaseButton'
import RoomListingFilters from './RoomListingFilters'
import useTitle from 'helpers/useTitle'

export const GET_ALL_ROOMS = gql`
  query GetRoomListing($filters: GetAllRoomsInput, $offset: Int, $limit: Int) {
    allRooms(filters: $filters, offset: $offset, limit: $limit) {
      id
      name
      pixels
      views
      createdAt
    }
  }
`

function RoomListingLoader () {
  return (
    <StyledRoomListingLoader>
      <BaseLoader size={50}/>
    </StyledRoomListingLoader>
  )
}

const MAX_ROOMS_PER_LOAD = 35

function RoomListing () {
  useTitle('Cube-room | Index')
  const filters = useSelector(state => state.roomListingFilters)
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(true)

  const { loading, data, fetchMore } = useQuery(GET_ALL_ROOMS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    variables: {
      filters,
      offset: 0,
      limit: MAX_ROOMS_PER_LOAD,
    },
    // If we reached the end of the list, hide the load more button
    onCompleted: (data) => {
      if ((data?.allRooms?.length || 0) < MAX_ROOMS_PER_LOAD) {
        setShowLoadMoreButton(false)
      }
    },
  })

  // Load more button should be available again when changing filters
  useEffect(() => {
    setShowLoadMoreButton(true)
  }, [filters])

  const rooms = data?.allRooms || []

  function loadMoreRooms () {
    fetchMore({
      variables: {
        offset: rooms.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev

        // If we reached the end of the list, hide the load more button
        if (!fetchMoreResult.allRooms.length || fetchMoreResult.allRooms.length < MAX_ROOMS_PER_LOAD) {
          setShowLoadMoreButton(false)
        }

        return {
          ...prev,
          allRooms: [
            ...prev.allRooms,
            ...fetchMoreResult.allRooms,
          ],
        }
      },
    })
  }

  return (
    <Layout title="Cuberoom">
      <Container>
        <RoomListingFilters/>
        {!data && loading
          ? <RoomListingLoader/>
          : (
            <>
              <ListingContainer>
                {rooms.map((room) => <RoomThumbnailLink key={room.id} room={room}/>)}
              </ListingContainer>
              {showLoadMoreButton &&
                <LoadMoreButton
                  onClick={loadMoreRooms}
                  loading={loading}
                />
              }
            </>
          )
        }
      </Container>
    </Layout>
  )
}


const ListingContainer = styled.div`
  margin-top: 30.6px;
  display: grid;
  grid-template-columns: repeat(7, 120px);
  grid-gap: 30.6px;
`

const Container = styled(Flex).attrs(() => ({
  col: true,
}))`
  flex-grow: 1;
`

const LoadMoreButton = styled(BaseButton).attrs(() => ({
  children: 'Load more',
}))`
  width: 200px;
  margin: auto;
  margin-top: 64px;
`

const StyledRoomListingLoader = styled(Flex).attrs(() => ({
  justifyCenter: true,
  itemsCenter: true,
}))`
  flex-grow: 1;
`

export default RoomListing

import React from 'react'
import Flex from 'components/ui/Flex'
import TargetSrc from 'assets/icons/target.svg'
import { Link } from 'react-router-dom'
import Routes, { generateRoute } from 'constants/Routes'
import styled from 'styled-components'
import Colors from 'constants/Colors'
import PixelsVisualizer from 'components/PixelsVisualizer/PixelsVisualizer'
import ViewsSrc from 'assets/icons/views.svg'
import moment from 'moment'
import PropTypes from 'prop-types'

function RoomThumbnailLink ({
  room: {
    id,
    pixels,
    name,
    views,
    createdAt,
  },
}) {
  return (
    <Link to={generateRoute(Routes.ROOM, { roomId: id })}>
      <Container>
        <PixelsContainer>
          <Overlay>
            <img src={TargetSrc} alt="Access room"/>
          </Overlay>
          <PixelsVisualizer
            size={120}
            pixels={pixels}
          />
        </PixelsContainer>
        <Information>
          <RoomName>{name}</RoomName>
          <Views>
            {views}
            <ViewsIcon/>
          </Views>
        </Information>
        <RoomCreationDate>
          {moment(createdAt).format('L')}
        </RoomCreationDate>
      </Container>
    </Link>
  )
}

RoomThumbnailLink.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.string.isRequired,
    pixels: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    views: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
  }),
}

RoomThumbnailLink.defaultProps = {
}


const Overlay = styled(Flex).attrs(() => ({
  justifyCenter: true,
  itemsCenter: true,
}))`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  transition: all 0.3s ease;
  opacity: 0;
  border-radius: 4px;
  box-shadow: 0 0 0 3px rgba(0, 116, 217, 0.2);
  cursor: pointer;
  color: white;
  padding: 16px;
  z-index: 50;
`

const PixelsContainer = styled.div`
  position: relative;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  width: 120px;
  height: 120px;
`

const Information = styled(Flex).attrs(() => ({
  itemsCenter: true,
}))`
  margin-top: 8px;
  filter: grayscale(1);
`

const RoomCreationDate = styled.div`
  font-size: 0.7rem;
  filter: grayscale(1);
`

const Container = styled.div`
  position: relative;
  border-radius: 4px;
  transition: all 0.3s ease;
  color: ${Colors.BLUE};

  &:hover ${Overlay} {
    opacity: 1;
  }

  &:hover ${Information},
  &:hover ${RoomCreationDate} {
    filter: grayscale(0);
  }
`

const RoomName = styled.h3`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  font-size: 0.9rem;
`

const Views = styled(Flex).attrs(() => ({
  itemsCenter: true,
}))`
  font-size: 0.8rem;
  margin-left: 8px;
`

const ViewsIcon = styled.img.attrs(() => ({
  src: ViewsSrc,
}))`
  margin-left: 8px;
`


export default RoomThumbnailLink

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { gql, useMutation } from '@apollo/client'
import styled from 'styled-components'
import Flex from 'components/ui/Flex'
import UnlockSrc from 'assets/icons/unlock.svg'
import EditSrc from 'assets/icons/edit.svg'
import BaseInput, { GenericInputStyle } from 'components/form/BaseInput'
import Colors from 'constants/Colors'
import { hexToRgbaString } from 'helpers/Color'
import Routes, { generateRoute } from 'constants/Routes'
import ReactTooltip from 'react-tooltip'
import PropTypes from 'prop-types'

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

function EditRoomButton ({ roomId, ...rest }) {
  return (
    <Container {...rest}>
      <ReactTooltip effect='solid'/>
      <Link to={generateRoute(Routes.EDIT_ROOM, { roomId })}>
        <ActionButton data-tip='Edit room'>
          <img src={EditSrc} alt='Edit room'/>
        </ActionButton>
      </Link>
    </Container>
  )
}

EditRoomButton.propTypes = {
  roomId: PropTypes.string.isRequired,
}


function UnlockRoomButton ({ roomId, ...rest }) {
  const [password, setPassword] = useState('')
  const [unlockRoomMutation] = useMutation(UNLOCK_ROOM)

  async function unlockRoom () {
    if (!password) {
      return
    }

    try {
      // Unlock current room to get edit scope, refresh token in storage
      const { data } = await unlockRoomMutation({
        variables: {
          roomId,
          password,
        },
      })

      localStorage.setItem('token', data.unlockRoom.token)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Container {...rest}>
      <ReactTooltip effect='solid'/>
      <ActionButton
        data-tip='You need to unlock the room to edit it'
        onClick={unlockRoom}
      >
        <img src={UnlockSrc} alt='Unlock room'/>
      </ActionButton>
      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={({ key }) => key === 'Enter' && unlockRoom()}
      />
    </Container>
  )
}

UnlockRoomButton.propTypes = {
  roomId: PropTypes.string.isRequired,
}

const PasswordInput = styled(BaseInput).attrs(() => ({
  placeholder: 'Enter room password',
}))`
  margin-left: 16px;
  opacity: 0;
  transition: all 0.3s ease;
`

const Container = styled(Flex).attrs(() => ({
  justifyCenter: true,
}))`
  position: absolute;
  z-index: 50;
  bottom: 100%;
  margin-bottom: 16px;

  &:hover ${PasswordInput} {
    opacity: 1;
  }
`

const ActionButton = styled.button`
  ${GenericInputStyle}

  cursor: pointer;
  background-color: transparent;
  border: 0;
  filter: grayscale(1);

  &:hover {
    background-color: ${hexToRgbaString(Colors.LIGHT_BLUE, 0.05)};
    filter: grayscale(0);
    border: 0;
  }
`

export {
  EditRoomButton,
  UnlockRoomButton,
}
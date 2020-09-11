import React from 'react'
import styled from 'styled-components'
import Flex from 'components/ui/Flex'
import Colors from 'constants/Colors'
import moment from 'moment'
import PropTypes from 'prop-types'

function ChatMessage ({
  username,
  content,
  createdAt,
  ...rest
}) {
  return (
    <StyledChatMessage {...rest}>
      <Flex col>
        <Message>
          <Username>{username}:&nbsp;</Username>
          <Content>{content}</Content>
        </Message>
        <Date>{moment(createdAt).format('L LT')}</Date>
      </Flex>
    </StyledChatMessage>
  )
}

ChatMessage.propTypes = {
  username: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
}

ChatMessage.defaultProps = {
}

const StyledChatMessage = styled.div`
  width: 100%;
  &:not(:last-child) {
    margin-bottom: 16px;
  }
`

const Message = styled.p`
  font-size: 0.8rem;
  overflow-wrap: break-word
`
const Content = styled.span`
  color: ${Colors.DARK_BLUE};
`

const Username = styled.span`
  font-weight: 500;
  color: ${Colors.BLACK};
`

const Date = styled.div`
  font-size: 0.7rem;
  color: ${Colors.BLUE};
  margin-top: 4px;
`

export default ChatMessage
import React from 'react'
import styled from 'styled-components'
import Flex from 'components/ui/Flex'
import Colors from 'constants/Colors'
import Routes, { generateRoute } from 'constants/Routes'
import { Link } from 'react-router-dom'

function Page404 () {
  return (
    <StyledPage404>
      <Title>404</Title>
      <Subtitle>
        You got lost ? No worries, here is a <Link to={generateRoute(Routes.INDEX)}>link back to home</Link>
      </Subtitle>
    </StyledPage404>
  )
}

const StyledPage404 = styled(Flex).attrs(() => ({
  col: true,
  itemsCenter: true,
  justifyCenter: true,
}))`
  width: 100vw;
  height: 100vh;
`

const Title = styled.h1`
  color: ${Colors.DARK_BLUE};
  font-size: 64px;
`

const Subtitle = styled.h3`
  font-weight: 300;
  margin-top: 16px;

  a {
    color: ${Colors.BLUE};
    font-weight: 400;
  }

  a:hover {
    text-decoration: underline;
  }
`

export default Page404
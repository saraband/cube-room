import React from 'react'
import Colors from 'constants/Colors'
import { Link, useLocation } from 'react-router-dom'
import Routes from 'constants/Routes'
import styled from 'styled-components'
import Flex from 'components/ui/Flex'
import ArrowBackSrc from 'assets/icons/arrow-back.svg'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'

function Layout (props) {
  const {
    children,
    title,
  } = props
  const { pathname } = useLocation()
  const isHomePage = pathname === Routes.INDEX

  return (
    <Container {...props}>
      <Header>
        <Title>
          {!isHomePage && <ArrowBack/>}
          {title}
        </Title>
      </Header>
      {children}
    </Container>
  )
}

Layout.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
}

Layout.defaultProps = {
}

const Container = styled(Flex).attrs(() => ({
  col: true,
}))`
  max-width: 1024px;
  min-height: 100vh;
  margin: auto;
  padding-top: 64px;
  padding-bottom: 64px;
`

const Header = styled(Flex).attrs(() => ({
  col: true,
  itemsCenter: true,
}))`
  margin-bottom: 64px;
`

const Title = styled.h1`
  display: flex;
  align-items: center;
  font-size: 2rem;
  margin-bottom: 32px;
  text-align: center;
  color: ${Colors.BLACK};
`

const HomeLink = styled(Link).attrs(() => ({
  to: Routes.INDEX,
}))`
  display: flex;
  align-items: center;
  margin-right: 16px;
  margin-top: 4px;
  transition: all 0.15s ease;
  opacity: 0.6;

  &:hover {
    opacity: 1;
  }
`

function ArrowBack () {
  return (
    <HomeLink>
      <ReactTooltip effect='solid'/>
      <img
        data-tip='Home'
        src={ArrowBackSrc}
        alt="Back to rooms listing"
      />
    </HomeLink>
  )
}

export default Layout

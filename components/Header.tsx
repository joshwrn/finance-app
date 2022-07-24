import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  h1 {
    font-size: 50px;
  }
  h2 {
    font-size: 40px;
  }
  h3 {
    font-size: 30px;
  }
`

const Header = ({ children }) => {
  return <Container>{children}</Container>
}

export default Header

import type { FC } from 'react'
import React from 'react'

import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  pointer-events: none;
`

const HorizontalLine = styled.div`
  width: 100vw;
  height: 1px;
  background: green;
  z-index: 9999;
  position: fixed;
`
const VerticalLine = styled.div`
  width: 1px;
  height: 100vh;
  background: green;
  z-index: 9999;
  position: fixed;
`

export const Aligner: FC = () => {
  return (
    <Wrapper>
      <HorizontalLine />
      <VerticalLine />
    </Wrapper>
  )
}

import type { FC } from 'react'
import React from 'react'

import styled from 'styled-components'

import TrashIcon from './TrashIcon'

const Container = styled.div`
  display: flex;
  position: fixed;
  bottom: 50px;
  left: 50%;
  z-index: 5;
  svg {
    cursor: pointer;
    fill: var(--fc-secondary);
  }
`

const ActionBar: FC = () => {
  return (
    <Container>
      <TrashIcon />
    </Container>
  )
}

export default ActionBar

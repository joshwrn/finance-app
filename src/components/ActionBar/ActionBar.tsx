import type { FC } from 'react'
import React from 'react'

import type { HoverTypes } from '@state/drag'
import { currentDragState, currentHoverState } from '@state/drag'
import { AnimatePresence, motion } from 'framer-motion'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'

import { PurchaseIcon } from './PurchaseIcon'
import TrashIcon from './TrashIcon'

const Container = styled.div`
  display: flex;
  position: fixed;
  bottom: 50px;
  left: 42.7%;
  z-index: 5;
  gap: 30px;
  justify-content: center;
  svg {
    cursor: pointer;
  }
`
const BlurLight = styled(motion.div)<{ currentHover: HoverTypes | null }>`
  position: fixed;
  width: 35%;
  height: 60px;
  background: red;
  z-index: -1;
  bottom: 0;
  border-radius: 90% 90% 0 0;
  pointer-events: none;
  opacity: 0.5;
  filter: blur(70px);
  transition: background 0.9s;
  background: ${({ currentHover }) => {
    switch (currentHover) {
      case `move`:
        return `var(--color-eucalyptus);`
      case `trash`:
        return `var(--color-coral);`
      default:
        return `var(--fc-tertiary);`
    }
  }};
`

const ActionBar: FC = () => {
  const currentItem = useRecoilValue(currentDragState)
  const currentHover = useRecoilValue(currentHoverState)
  return (
    <Container>
      <TrashIcon />
      <PurchaseIcon />
      <AnimatePresence>
        {currentItem.id && (
          <BlurLight
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 0.5, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            currentHover={currentHover.type}
          />
        )}
      </AnimatePresence>
    </Container>
  )
}

export default ActionBar

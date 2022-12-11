import type { FC } from 'react'
import React from 'react'

import type { HoverTypes } from '@state/drag'
import {
  anchorPointState,
  currentDragState,
  currentHoverState,
} from '@state/drag'
import { AnimatePresence, motion } from 'framer-motion'
import { HiOutlineShoppingCart } from 'react-icons/hi'
import { IoTrash } from 'react-icons/io5'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'

import { Icon, IconContainer } from './Icon'

const Wrapper = styled.div`
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
`

const Container = styled.div`
  display: flex;
  position: relative;
  z-index: 5;
  justify-content: center;
  align-items: center;
  transform: translate(-45%, -50%);
  svg {
    cursor: pointer;
  }

  ${IconContainer} {
    :nth-of-type(1) {
      transform: translate(100%, 0%);
    }
    :nth-of-type(2) {
      transform: translate(75%, -125%);
    }
    :nth-of-type(3) {
      transform: translate(100%, -200%);
    }
    :nth-of-type(4) {
      transform: translate(125%, -125%);
    }
    :nth-of-type(5) {
      transform: translate(100%, 0%);
    }
    :nth-of-type(6) {
      transform: translate(-325%, 125%);
    }
    :nth-of-type(7) {
      transform: translate(-300%, 200%);
    }
    :nth-of-type(8) {
      transform: translate(-275%, 125%);
    }
  }
`
const BlurLight = styled(motion.div)<{ currentHover: HoverTypes | null }>`
  position: absolute;
  width: 300px;
  height: 300px;
  background: red;
  z-index: -1;
  border-radius: 90%;
  pointer-events: none;
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
  const anchorPoint = useRecoilValue(anchorPointState)
  return (
    <Wrapper
      style={{
        top: anchorPoint.y ?? 0,
        left: anchorPoint.x ?? 0,
      }}
    >
      <Container>
        <Icon action="trash" Icon={IoTrash} />
        <Icon action="move" Icon={HiOutlineShoppingCart} />
        <Icon action="trash" Icon={IoTrash} />
        <Icon action="move" Icon={HiOutlineShoppingCart} />
        <Icon action="trash" Icon={IoTrash} />
        <Icon action="move" Icon={HiOutlineShoppingCart} />
        <Icon action="trash" Icon={IoTrash} />
        <Icon action="move" Icon={HiOutlineShoppingCart} />
        <AnimatePresence>
          {currentItem.id && (
            <BlurLight
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              currentHover={currentHover.type}
            />
          )}
        </AnimatePresence>
      </Container>
    </Wrapper>
  )
}

export default ActionBar

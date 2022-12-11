import type { FC } from 'react'
import React from 'react'

import type { HoverTypes } from '@state/drag'
import {
  currentDragState,
  currentHoverState,
  DEFAULT_HOVER_STATE,
} from '@state/drag'
import { AnimatePresence, motion } from 'framer-motion'
import type { IconType } from 'react-icons'
import { useRecoilState, useRecoilValue } from 'recoil'
import styled from 'styled-components'

export const IconContainer = styled(motion.div)<{ action: HoverTypes }>`
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  width: 70px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  :hover {
    svg {
      ${({ action }) => {
        switch (action) {
          case `move`:
            return `stroke: var(--color-eucalyptus);`
          case `trash`:
            return `fill: var(--color-coral);`
        }
      }}
    }
  }
  svg {
    transition: fill 0.2s ease-in-out;
  }
`

const variants = {
  initial: {
    opacity: 0,
    scale: 0,
  },
  animate: (currentHover: boolean) => ({
    opacity: 1,
    scale: currentHover ? 1.2 : 1,
  }),
  exit: (currentHover: boolean) => ({
    y: currentHover ? [0, -60, 150] : 150,
    scale: currentHover ? [0.5, 1.3, 0] : 0,
    transition: {
      type: `spring`,
      stiffness: currentHover ? 20 : 100,
    },
  }),
}

export const Icon: FC<{ action: HoverTypes; Icon: IconType }> = ({
  action,
  Icon,
}) => {
  const currentItem = useRecoilValue(currentDragState)
  const [currentHover, setCurrentHover] = useRecoilState(currentHoverState)
  return (
    <AnimatePresence>
      {currentItem.id && (
        <IconContainer
          onMouseOver={() => setCurrentHover({ type: action, id: null })}
          onMouseLeave={() => setCurrentHover(DEFAULT_HOVER_STATE)}
          custom={currentHover.type === action}
          action={action}
        >
          <Icon size={24} color="var(--fc-secondary)" />
        </IconContainer>
      )}
    </AnimatePresence>
  )
}

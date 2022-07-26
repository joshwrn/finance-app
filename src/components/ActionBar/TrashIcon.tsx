import type { FC } from 'react'
import React from 'react'

import {
  currentDragState,
  currentHoverState,
  DEFAULT_HOVER_STATE,
} from '@state/drag'
import { AnimatePresence, motion } from 'framer-motion'
import { IoTrash } from 'react-icons/io5'
import { useRecoilState, useRecoilValue } from 'recoil'
import styled from 'styled-components'

const DragContainer = styled(motion.div)`
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  width: 90px;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  svg {
    fill: var(--fc-secondary);
  }
  :hover {
    svg {
      fill: var(--color-coral);
    }
  }
  svg {
    transition: fill 0.2s ease-in-out;
  }
`

const trashVariants = {
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

const TrashIcon: FC = () => {
  const currentItem = useRecoilValue(currentDragState)
  const [currentHover, setCurrentHover] = useRecoilState(currentHoverState)
  return (
    <AnimatePresence>
      {currentItem.id && (
        <DragContainer
          onMouseOver={() => setCurrentHover({ type: `trash`, id: null })}
          onMouseLeave={() => setCurrentHover(DEFAULT_HOVER_STATE)}
          variants={trashVariants}
          initial={`initial`}
          animate={`animate`}
          exit={`exit`}
          custom={currentHover.type === `trash`}
        >
          <IoTrash size={36} />
        </DragContainer>
      )}
    </AnimatePresence>
  )
}

export default TrashIcon

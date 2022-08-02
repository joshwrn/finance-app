import { AnimatePresence, motion } from 'framer-motion'
import { useAtom, useAtomValue } from 'jotai'
import React from 'react'
import { IoTrash } from 'react-icons/io5'
import styled from 'styled-components'

import { currentHoverState, currentItemState } from '~/state/drag'

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

const TrashIcon = () => {
  const currentItem = useAtomValue(currentItemState)
  const [currentHover, setCurrentHover] = useAtom(currentHoverState)
  return (
    <AnimatePresence>
      {currentItem && (
        <DragContainer
          onMouseOver={() => setCurrentHover(`trash`)}
          onMouseLeave={() => setCurrentHover(null)}
          variants={trashVariants}
          initial={`initial`}
          animate={`animate`}
          exit={`exit`}
          custom={currentHover === `trash`}
        >
          <IoTrash size={36} />
        </DragContainer>
      )}
    </AnimatePresence>
  )
}

export default TrashIcon
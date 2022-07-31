import React from 'react'
import styled from 'styled-components'
import { IoTrash } from 'react-icons/io5'
import { AnimatePresence, motion } from 'framer-motion'
import { useAtom, useAtomValue } from 'jotai'
import { currentHoverState, currentItemState } from '~/state/drag'

const DragContainer = styled(motion.div)`
  svg {
    transition: fill 0.2s ease-in-out;
    :hover {
      fill: var(--color-coral);
    }
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
    opacity: 0,
    y: currentHover ? [0, -20, 150] : 150,
    scale: currentHover ? [0.5, 1.3, 0] : 0,
    transition: {
      type: 'spring',
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
          onMouseOver={() => setCurrentHover('trash')}
          onMouseLeave={() => setCurrentHover(null)}
          variants={trashVariants}
          initial={'initial'}
          animate={'animate'}
          exit={'exit'}
          custom={currentHover === 'trash'}
        >
          <IoTrash size={26} />
        </DragContainer>
      )}
    </AnimatePresence>
  )
}

export default TrashIcon

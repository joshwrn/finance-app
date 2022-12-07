import type { FC } from 'react'
import React, { useState } from 'react'

import type { SetState } from '@state/index'
import { motion, AnimatePresence } from 'framer-motion'
import { Portal } from 'react-portal'
import styled from 'styled-components'

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  /* background-color: var(--bg-primary); */
`
const ModalContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 800px;
  width: 100%;
  height: fit-content;
  max-height: 500px;
  border-radius: 20px;
  backdrop-filter: blur(30px);
  border: 1px solid var(--color-white-10);
  box-shadow: 0 0 50px var(--color-black-50);
`
const Backdrop = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
`

/* defining the modal component inside the hook causes 
the exit animation to NOT be triggered */

interface Modal {
  isOpen: boolean
  setIsOpen: SetState<boolean>
  children?: React.ReactNode
}

export const Modal: FC<Modal> = ({ children, isOpen, setIsOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Portal>
          <Container key={`modal`}>
            <ModalContainer
              initial={{ opacity: 1, y: `50vh` }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 1, y: `100vh` }}
            >
              {children}
            </ModalContainer>
            <Backdrop onClick={() => setIsOpen(false)} />
          </Container>
        </Portal>
      )}
    </AnimatePresence>
  )
}

const useModal = (): {
  isOpen: boolean
  setIsOpen: SetState<boolean>
  Modal: FC<Modal>
} => {
  const [isOpen, setIsOpen] = useState(false)

  return {
    isOpen,
    setIsOpen,
    Modal: Modal,
  }
}

export default useModal

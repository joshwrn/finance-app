import React, { useState } from 'react'
import styled from 'styled-components'
import { Portal } from 'react-portal'
import { motion, AnimatePresence } from 'framer-motion'

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
  background-color: var(--bg-primary);
`
const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 800px;
  width: 100%;
  height: fit-content;
  max-height: 500px;
  background-color: var(--bg-item);
  border-radius: 20px;
`
const Backdrop = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
  backdrop-filter: blur(30px);
`

const ModalComp = ({
  children,
  isOpen,
  setIsOpen,
}: {
  children?: React.ReactNode
  isOpen: boolean
  setIsOpen: any
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Portal>
          <Container
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            key={'modal'}
          >
            <ModalContainer>{children}</ModalContainer>
            <Backdrop onClick={() => setIsOpen(false)} />
          </Container>
        </Portal>
      )}
    </AnimatePresence>
  )
}

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  return {
    isOpen,
    setIsOpen,
    Modal: ModalComp,
  }
}

export default useModal

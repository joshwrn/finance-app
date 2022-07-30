import React from 'react'
import styled from 'styled-components'
import { IoWallet, IoTrash } from 'react-icons/io5'
import Avatar from '@assets/image/avatar.jpg'
import { FaClipboardList } from 'react-icons/fa'
import Image from 'next/image'
import { Divider } from './Divider'
import { motion } from 'framer-motion'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { currentItemState } from '@state/item'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 80px;
  height: 100vh;
  background-color: var(--bg-sidebar);
  position: relative;
  z-index: 2;
  padding: 50px 10px;
  align-items: center;
  gap: 30px;
  svg {
    cursor: pointer;
  }
  > .sb-img-container {
    width: 40px;
    height: 40px;
    border: 1px solid var(--bg-item);
    overflow: hidden;
    border-radius: 50%;
    img {
      object-fit: cover;
    }
  }
`

const DragContainer = styled(motion.div)``

export const trashHoverState = atom(false)

const Sidebar = () => {
  const currentItem = useAtomValue(currentItemState)
  const setTrashHover = useSetAtom(trashHoverState)

  return (
    <Container>
      <div className="sb-img-container">
        <Image src={Avatar} layout={'fixed'} width={40} height={40} />
      </div>
      <Divider />
      <FaClipboardList size={26} color={'var(--fc-secondary)'} />
      <IoWallet size={26} color={'var(--fc-secondary)'} />
      {currentItem !== '' && (
        <DragContainer
          onMouseOver={() => setTrashHover(true)}
          onMouseUp={() => setTrashHover(false)}
        >
          <IoTrash size={26} color={'var(--fc-secondary)'} />
        </DragContainer>
      )}
    </Container>
  )
}

export default Sidebar

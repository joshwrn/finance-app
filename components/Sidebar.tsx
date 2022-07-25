import React from 'react'
import styled from 'styled-components'
import { IoWallet } from 'react-icons/io5'
import Avatar from '@assets/image/avatar.jpg'
import { FaClipboardList } from 'react-icons/fa'
import Image from 'next/image'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 80px;
  height: 100vh;
  background-color: var(--bg-sidebar);
  position: relative;
  z-index: 5;
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

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: var(--bg-item);
`

const Sidebar = () => {
  return (
    <Container>
      <div className="sb-img-container">
        <Image src={Avatar} layout={'fixed'} width={40} height={40} />
      </div>
      <Divider />
      <FaClipboardList size={26} color={'var(--fc-secondary)'} />
      <IoWallet size={26} color={'var(--fc-secondary)'} />
    </Container>
  )
}

export default Sidebar

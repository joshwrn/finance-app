import Avatar from '@assets/image/avatar.jpg'
import Image from 'next/image'
import React from 'react'
import { FaClipboardList } from 'react-icons/fa'
import { IoWallet } from 'react-icons/io5'
import styled from 'styled-components'

import { Divider } from '../Divider'
import TrashIcon from './TrashIcon'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 80px;
  height: 100vh;
  background-color: var(--bg-sidebar);
  position: fixed;
  z-index: 2;
  padding: 50px 10px;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  svg {
    cursor: pointer;
    fill: var(--fc-secondary);
  }
`
const IconsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 100%;
`
const Top = styled(IconsContainer)`
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
const Bottom = styled(IconsContainer)``

const Sidebar = () => {
  return (
    <Container>
      <Top>
        <div className="sb-img-container">
          <Image src={Avatar} layout={`fixed`} width={40} height={40} />
        </div>
        <Divider />
        <FaClipboardList size={26} />
        <IoWallet size={26} />
      </Top>
      <Bottom></Bottom>
    </Container>
  )
}

export default Sidebar

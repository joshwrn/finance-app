import type { FC } from 'react'
import React from 'react'

import { userState } from '@state/user'
import { signOut } from 'next-auth/react'
import { FaClipboardList } from 'react-icons/fa'
import { IoWallet } from 'react-icons/io5'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'

import { Divider } from './Divider'
import { DropdownMenu } from './DropdownMenu'

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
    fill: var(--fc-tertiary);
  }
`
const Top = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 100%;
`
const ImageContainer = styled.div`
  cursor: pointer;
  img {
    border: 1px solid var(--bg-item);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    position: relative;
  }
`

const Sidebar: FC = () => {
  const user = useRecoilValue(userState)
  const [showMenu, setShowMenu] = React.useState(false)
  return (
    <Container>
      <Top>
        <DropdownMenu setShow={setShowMenu} show={showMenu}>
          <button onClick={() => signOut()}>Sign Out</button>
        </DropdownMenu>
        <ImageContainer onClick={() => setShowMenu((prev) => !prev)}>
          <img src={user.image ?? ``} width={40} height={40} />
        </ImageContainer>
        <Divider />
        <FaClipboardList size={26} />
        <IoWallet size={26} />
      </Top>
    </Container>
  )
}

export default Sidebar

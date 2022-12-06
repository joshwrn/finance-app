import type { FC } from 'react'
import React from 'react'

import { userState } from '@state/user'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { BsWallet2 } from 'react-icons/bs'
import { IoPricetagOutline } from 'react-icons/io5'
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
    stroke: var(--fc-tertiary);
    path {
      stroke: var(--fc-tertiary);
    }
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
  overflow: hidden;
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--color-eucalyptus);
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
        {user.image && (
          <ImageContainer onClick={() => setShowMenu((prev) => !prev)}>
            <Image src={user.image ?? ``} layout="fill" />
          </ImageContainer>
        )}
        <Divider />
        <Link href={`/expenses`}>
          <IoPricetagOutline size={26} />
        </Link>
        <Link href={`/wishlist`}>
          <BsWallet2 size={22} />
        </Link>
      </Top>
    </Container>
  )
}

export default Sidebar

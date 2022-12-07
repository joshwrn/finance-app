import type { FC } from 'react'
import React from 'react'

import { useOutsideClick } from '@hooks/useOutsideClick'
import styled from 'styled-components'

export const DropdownMenu: FC<{
  children: React.ReactNode
  show: boolean
  setShow: (show: boolean) => void
  style?: React.CSSProperties
}> = ({ children, show, setShow, style }) => {
  const ref = useOutsideClick(() => setShow(false))
  return (
    <>
      {show && (
        <Container ref={ref} style={style}>
          {children}
        </Container>
      )}
    </>
  )
}

const Container = styled.div`
  position: absolute;
  left: 100%;
  border: 1px solid var(--color-white-20);
  background-color: var(--bg-item);
  backdrop-filter: blur(50px);
  border-radius: 5px;
  width: 200px;
  z-index: 999;
  overflow: hidden;
  input {
    border: none;
    border-bottom: 1px solid var(--color-white-20);
    border-radius: 0;
    :focus {
      border: none;
      border-bottom: 1px solid var(--color-white-20);
    }
  }
  button {
    padding: 10px 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: var(--fc-primary);
    p {
      color: var(--fc-primary);
    }
    :hover {
      background-color: var(--bg-item);
    }
  }
`

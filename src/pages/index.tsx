import React, { useEffect } from 'react'

import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'
import styled from 'styled-components'

const Login: React.FC = () => {
  const { data: session, status } = useSession()

  const router = useRouter()

  useEffect(() => {
    if (status === `authenticated`) {
      router.push(`/wishlist`)
    }
  }, [session, status])

  return (
    <Wrapper>
      <Container>
        <button onClick={() => signIn()}>Login</button>
        <button onClick={() => signIn()}>Create Account</button>
      </Container>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  border: 1px solid var(--color-white-20);
  border-radius: 10px;
  padding: 100px 100px;
  background-color: var(--bg-item);
  button {
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    background-color: var(--color-white-20);
    color: var(--fc-primary);
    font-weight: 550;
    font-size: 14px;
    cursor: pointer;
  }
`

export default Login

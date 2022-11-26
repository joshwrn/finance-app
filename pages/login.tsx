import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import React from 'react'

export default function login() {
  const { data: session, status } = useSession()

  const router = useRouter()

  useEffect(() => {
    if (status === `authenticated`) {
      router.push(`/`)
    }
  }, [session, status])

  return (
    <div>
      log in
      <button onClick={() => signIn()}>sign in</button>
      <button onClick={() => signOut()}>sign out</button>
      <button onClick={() => console.log(session)}>log session</button>
    </div>
  )
}

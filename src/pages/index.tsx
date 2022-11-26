import ActionBar from '@components/ActionBar'
import MainButton from '@components/Button'
import Category from '@components/Category'
import { DropdownMenu } from '@components/DropdownMenu'
import Header from '@components/Header'
import { NewCategoryButton } from '@components/NewCategoryButton'
import Sidebar from '@components/Sidebar'
import { RecoilInspector } from '@eyecuelab/recoil-devtools'
import prisma from '@lib/prisma'
import type { UserWithItems, CategoryWithItems } from '@prisma/prismaTypes'
import { DEFAULT_USER, userState } from '@state/user'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { LayoutGroup, motion } from 'framer-motion'
import type { GetServerSideProps } from 'next'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import styled, { css } from 'styled-components'

// import RecoilInspector from '~/tools/recoilDevTools/DebugInspector'

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
  overflow: visible;
  z-index: 1;
  color: rgba(255, 255, 255, 0.7);
  padding: 100px;
  padding-left: 180px;
`
const SectionHeader = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: relative;
  z-index: 1000;
`

export default function Home() {
  const { data: session, status } = useSession()
  const user = useRecoilValue(userState)
  const router = useRouter()

  useEffect(() => {
    if (!session && status === `unauthenticated`) {
      router.push(`/login`)
    }
  }, [session, status])

  const { data: categories } = useQuery(
    [`categories`],
    async () =>
      axios
        .get(`/api/category/findMany`, {
          params: {
            id: user.id,
          },
        })
        .then((res) => res.data.categories),
    { placeholderData: [], enabled: user.email !== `` },
  )

  const setUser = useSetRecoilState(userState)

  const { data: userData, refetch } = useQuery(
    [`user`],
    async () =>
      axios
        .get(`/api/user/current`, {
          params: {
            email: session?.user?.email ?? ``,
          },
        })
        .then((res) => res.data),
    {
      placeholderData: DEFAULT_USER,
      onSuccess: (data) => setUser(data.user),
      enabled: !!session,
    },
  )

  return (
    <>
      <Sidebar />
      <ActionBar />
      <Container>
        <button onClick={() => console.log(session)}>log session</button>
        <SectionHeader>
          <h1>Wishlists</h1>
          <NewCategoryButton />
        </SectionHeader>
        <LayoutGroup>
          {categories?.map((category: CategoryWithItems) => (
            <Category key={category.id + `wishlist`} categoryId={category.id} />
          ))}
        </LayoutGroup>
      </Container>
    </>
  )
}

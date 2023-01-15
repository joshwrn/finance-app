// eslint-disable-next-line import/extensions
import Background from '@assets/image/bg.png'
import { ContextMenu } from '@components/ContextMenu'
import { GlobalStyle } from '@styles/GlobalStyle'
import { darkTheme } from '@styles/theme'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { trpc } from '@utils/trpc'
import type { AppProps } from 'next/app'
import Image from 'next/image'
import { SessionProvider } from 'next-auth/react'
import { RecoilRoot } from 'recoil'
import styled, { ThemeProvider } from 'styled-components'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <ThemeProvider theme={darkTheme}>
          <ReactQueryDevtools initialIsOpen={false} />
          <GlobalStyle />
          <ContextMenu />
          <PageWrapper>
            {/* <Aligner /> */}
            <ComponentWrapper>
              <Component {...pageProps} />
            </ComponentWrapper>
            <BlurOverlay />
            <Image alt="bg" src={Background} fill />
          </PageWrapper>
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </RecoilRoot>
    </SessionProvider>
  )
}

export default trpc.withTRPC(MyApp)

const PageWrapper = styled.main`
  display: flex;
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    object-fit: cover;
    z-index: -1;
  }
`

const BlurOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-primary);
  backdrop-filter: blur(40px);
  z-index: 1;
`

const ComponentWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: auto;
  z-index: 6;
`

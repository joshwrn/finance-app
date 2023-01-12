// eslint-disable-next-line import/extensions

// eslint-disable-next-line import/extensions
import Background from '@assets/image/bg.png'
import { ContextMenu } from '@components/ContextMenu'
import { GlobalStyle } from '@styles/GlobalStyle'
import { darkTheme } from '@styles/theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import Image from 'next/image'
import { RecoilRoot } from 'recoil'
import styled, { ThemeProvider } from 'styled-components'

const queryClient = new QueryClient()

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <ThemeProvider theme={darkTheme}>
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
      </QueryClientProvider>
    </SessionProvider>
  )
}

export default MyApp

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

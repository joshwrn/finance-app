import Background from '@assets/image/bg.png'
import { GlobalStyle } from '@styles/GlobalStyle'
import { darkTheme, lightTheme } from '@styles/theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Provider } from 'jotai'
import type { AppProps } from 'next/app'
import Image from 'next/image'
import { ThemeProvider } from 'styled-components'
import styled from 'styled-components'

const queryClient = new QueryClient()

export default function MyApp({ Component, pageProps }: AppProps) {
  const { initialState } = pageProps
  return (
    <ThemeProvider theme={darkTheme}>
      <QueryClientProvider client={queryClient}>
        <Provider initialValues={initialState}>
          <GlobalStyle />
          <PageWrapper>
            <ComponentWrapper>
              <Component {...pageProps} />
            </ComponentWrapper>
            <BlurOverlay />
            <Image src={Background} layout="fill" />
          </PageWrapper>
          <ReactQueryDevtools initialIsOpen={false} />
        </Provider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

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

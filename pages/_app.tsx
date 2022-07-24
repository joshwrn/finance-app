import type { AppProps } from 'next/app'
import Sidebar from '@components/Sidebar'
import styled from 'styled-components'
import Image from 'next/image'
import Background from '@assets/image/bg.png'
import { ThemeProvider } from 'styled-components'
import { darkTheme } from '@styles/theme'
import { GlobalStyle } from '@styles/GlobalStyle'

const BlurOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.73);
  backdrop-filter: blur(40px);
  z-index: 1;
`

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyle />
      <PageWrapper>
        <Sidebar />
        <ComponentWrapper>
          <Component {...pageProps} />
          <BlurOverlay />
          <Image src={Background} layout="fill" />
        </ComponentWrapper>
      </PageWrapper>
    </ThemeProvider>
  )
}

const PageWrapper = styled.main`
  display: flex;
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
`

const ComponentWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: auto;
  img {
    object-fit: cover;
  }
`

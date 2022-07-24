import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`

:root {
    --bg-primary: ${({ theme }) => theme.background.primary};
    --bg-sidebar: ${({ theme }) => theme.background.sidebar};
    --bg-item: ${({ theme }) => theme.background.item};

    --fc-primary: ${({ theme }) => theme.fontColor.primary};
    --fc-secondary: ${({ theme }) => theme.fontColor.secondary};
    --fc-tertiary: ${({ theme }) => theme.fontColor.tertiary};
    --fc-alternate: ${({ theme }) => theme.fontColor.alternate};

    --btn-primary: ${({ theme }) => theme.button.primary};

    --badge-primary: ${({ theme }) => theme.badge.primary};
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Inter, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  color: var(--font-color-primary);
  transition: background 0.3s ease-in-out, color 0.3s ease-in-out, background-color 0.3s ease-in-out;
}
  ::-webkit-scrollbar {
    display: none;
  }
  a {
    text-decoration: none;
  }
  p {
    color: var(--fc-tertiary);
  }

  h1, h2 {
    color: var(--fc-primary);
  }

  h3, h4, h5, h6 {
    color: var(--fc-secondary);
  }

textarea:focus,
input:focus {
  outline: none;
}
button:focus {
  outline: 0;
}
html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-size: 16px;
  background-color: black;
}
`

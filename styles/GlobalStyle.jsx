import { createGlobalStyle, css } from 'styled-components'

const styles = css`
  :root {
    ${({ theme }) =>
      Object.entries(theme).map(([catKey]) =>
        Object.entries(theme[catKey]).map(
          ([key, value]) => `--${catKey}-${key}: ${value};\n`,
        ),
      )}
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Inter, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    color: var(--fc-primary);
    transition: background 0.3s ease-in-out, color 0.3s ease-in-out,
      background-color 0.3s ease-in-out;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  a {
    text-decoration: none;
  }
  p,
  a,
  input {
    color: var(--fc-tertiary);
  }

  h1,
  h2 {
    color: var(--fc-primary);
    user-select: none;
  }

  h3,
  h4,
  h5,
  h6,
  label {
    color: var(--fc-secondary);
    user-select: none;
  }

  input {
    border: 1px solid var(--bg-item);
    outline: none;
    border-radius: 6px;
    background: none;
    height: 40px;
    width: 100%;
    padding-left: 12px;
    transition: border-color 0.2s ease-in-out;
    :focus {
      border-color: var(--btn-primary);
    }
  }

  button {
    user-select: none;
  }
  textarea:focus,
  input:focus {
    outline: none;
  }
  button:focus {
    outline: 0;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    font-size: 16px;
    background-color: black;
  }

  ul {
    list-style: none;
    width: 100%;
  }
  li {
    list-style: none;
    width: 100%;
  }
`

export const GlobalStyle = createGlobalStyle`
  ${styles}
`

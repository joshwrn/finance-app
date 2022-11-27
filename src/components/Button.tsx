import styled from 'styled-components'

const MainButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  width: fit-content;
  height: fit-content;
  padding: 10px 20px;
  background-color: var(--btn-primary);
  border-radius: 10px;
  border: none;
  margin-left: auto;
  margin-right: 7px;
  cursor: pointer;
  transition: box-shadow 0.5s;
  p {
    color: var(--fc-alternate);
    font-weight: 550;
    font-size: 14px;
  }
  &:hover {
    box-shadow: 0 0 15px rgb(77, 236, 185, 0.3);
  }
`

export default MainButton

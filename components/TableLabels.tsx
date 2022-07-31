import React from 'react'
import styled, { css } from 'styled-components'

export const tableLayout = css`
  display: flex;
  justify-content: space-between;
  p,
  a {
    width: 100%;
  }
  > p {
    :last-of-type {
      width: fit-content;
      white-space: nowrap;
    }
  }
`
const Container = styled.div`
  width: 100%;
  height: fit-content;
  padding: 0 50px;
  user-select: none;
  ${tableLayout}
`

const TableLabels = ({ labels }: { labels: string[] }) => {
  return (
    <Container>
      {labels.map((label) => {
        return <p key={label + 'table-label'}>{label}</p>
      })}
    </Container>
  )
}

export default TableLabels

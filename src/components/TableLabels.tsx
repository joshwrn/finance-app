import type { FC } from 'react'
import React from 'react'

import styled, { css } from 'styled-components'

export const tableLayout = css`
  display: flex;
  justify-content: space-between;
  > p,
  > a,
  > div {
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

const TableLabels: FC<{ labels: string[] }> = ({ labels }) => {
  return (
    <Container>
      {labels.map((label) => {
        return <p key={label + `table-label`}>{label}</p>
      })}
    </Container>
  )
}

export default TableLabels

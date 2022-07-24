import React from 'react'
import styled, { css } from 'styled-components'

export const tableLayout = css`
  display: flex;
  justify-content: space-between;
  p,
  a {
    width: 100px;
  }
`

const Container = styled.div`
  width: 100%;
  height: fit-content;
  padding: 0 50px;
  ${tableLayout}
`

const TableLabels = ({ labels }: { labels: string[] }) => {
  return (
    <Container>
      {labels.map((label) => {
        return <p>{label}</p>
      })}
    </Container>
  )
}

export default TableLabels

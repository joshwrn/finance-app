import { CategoryWithItems } from '~/prisma/types/prismaData'
import React, { useMemo, useState } from 'react'
import Item from '@components/Item'
import styled from 'styled-components'
import { Reorder } from 'framer-motion'
import Header from '@components/Header'
import { numberToCurrency } from '~/logic/utils'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import TableLabels from './TableLabels'
import { Item as ItemType } from '@prisma/client'
import useSWR from 'swr'
import { fetcher } from '@lib/fetcher'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  position: relative;
  padding-bottom: 50px;
  border-bottom: 1px solid var(--bg-item);
  ul {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
`

const HeadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: fit-content;
  position: relative;
  margin: 30px 0;
  h3 {
  }
  > p {
    margin-left: 30px;
    font-size: 17px;
    span {
      margin-left: 3px;
      color: var(--fc-secondary);
      font-weight: 550;
    }
  }
  svg {
    cursor: pointer;
    path {
      stroke: var(--fc-tertiary);
    }
  }
`

const NewItemButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
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

const Badge = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background: var(--badge-primary);
  top: -5px;
  right: -19px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  p {
    font-size: 12px;
    color: var(--fc-primary);
  }
`

const useItemCount = (id: string) => {
  const { data, error } = useSWR(`/api/item/count?id=${id}`, fetcher)
  return { count: data, isError: error, isLoading: !data && !error }
}

const Category = ({ category }: { category: CategoryWithItems }) => {
  const items: ItemType[] = category.items
  const [itemsArr, setItemsArr] = useState(items)
  const { count, isError, isLoading } = useItemCount(category.id)

  const total = useMemo(
    () => items.reduce((acc, item) => acc + Number(item.price), 0),
    [items]
  )
  const handleReorder = (e: ItemType[]) => {
    setItemsArr(e)
  }
  return (
    <Container>
      <HeadingContainer>
        <Header>
          <h3>{category.name}</h3>
          {!isLoading && !isError && count?.data > 0 && (
            <Badge>
              <p>{count.data}</p>
            </Badge>
          )}
        </Header>
        <p>
          Total <span>{numberToCurrency(total)}</span>
        </p>
        <NewItemButton>
          <p>+ New Item</p>
        </NewItemButton>
        <HiOutlineDotsVertical size={30} />
      </HeadingContainer>
      {items.length > 0 ? (
        <>
          <TableLabels labels={['Item', 'Link', 'Price', 'Date Added']} />
          <Reorder.Group values={items} onReorder={handleReorder}>
            {itemsArr.map((item) => (
              <Item item={item} key={item.name} />
            ))}
          </Reorder.Group>
        </>
      ) : (
        <p>No items yet</p>
      )}
    </Container>
  )
}

export default Category

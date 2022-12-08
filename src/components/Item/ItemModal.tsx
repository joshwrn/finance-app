import type { FC } from 'react'
import { useMemo } from 'react'

import { contextMenuState } from '@components/ContextMenu'
import { VALID_URL } from '@lib/yup'
import {
  useCreateItemMutation,
  useCreateSubItemMutation,
  useEditItemMutation,
} from '@state/entities/item'
import { userState } from '@state/user'
import { Formik, Form } from 'formik'
import { atom, useRecoilState, useRecoilValue } from 'recoil'
import styled from 'styled-components'
import * as Yup from 'yup'

import MainButton from '../Button'
import { Divider } from '../Divider'
import { Input } from '../FormFieldInput'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  position: relative;
  width: 100%;
  gap: 30px;
  padding: 50px 50px;
`
const StyledForm = styled(Form)`
  display: flex;
  width: 100%;
  position: relative;
  flex-direction: column;
  align-items: flex-end;
  gap: 20px;
  btn {
    margin-left: auto;
  }
`
const InputsContainer = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  justify-content: space-between;
  gap: 20px;
`

interface InputValues {
  name: string
  link: string
  price: string
}

const ItemInputSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, `Too Short!`)
    .max(25, `Too Long!`)
    .required(`Required`),
  price: Yup.string().required(`Required`),
  link: Yup.string().matches(VALID_URL, `Invalid URL`),
})

type ItemModalModes = `create` | `createSubItem` | `edit`

export const itemModalState = atom<{
  isOpen: boolean
  mode: ItemModalModes
  categoryId?: string
}>({
  key: `itemModalState`,
  default: {
    isOpen: false,
    mode: `create`,
    categoryId: ``,
  },
})

const ItemModal: FC = () => {
  const user = useRecoilValue(userState)
  const contextMenu = useRecoilValue(contextMenuState)
  const [{ mode, categoryId }, setModalState] = useRecoilState(itemModalState)
  const closeModal = () =>
    setModalState({ isOpen: false, mode: `create`, categoryId: `` })
  const { mutate: createItem } = useCreateItemMutation({
    categoryId: categoryId ?? ``,
    action: () => closeModal(),
  })
  const { mutate: createSubItem } = useCreateSubItemMutation({
    parentItem: contextMenu.item,
    action: () => closeModal(),
  })
  const { mutate: updateItem } = useEditItemMutation({
    onSuccess: () => closeModal(),
    categoryId: contextMenu.item?.categoryId ?? ``,
  })

  const Header = useMemo(() => {
    switch (mode) {
      case `edit`:
        return <h2>Edit Item</h2>
      case `create`:
        return <h2>Create New Item</h2>
      case `createSubItem`:
        return <h2>Create Sub Item</h2>
    }
  }, [mode])

  const initialValues = useMemo(() => {
    const defaultValues = {
      name: ``,
      link: ``,
      price: ``,
    }
    switch (mode) {
      case `edit`:
        return {
          name: contextMenu.item?.name ?? ``,
          link: contextMenu.item?.link ?? ``,
          price: contextMenu.item?.price?.toString() ?? ``,
        }
      default:
        return defaultValues
    }
  }, [mode, contextMenu.item])

  return (
    <Container>
      {Header}
      <Divider />
      <Formik
        initialValues={initialValues}
        onSubmit={(values: InputValues) => {
          switch (mode) {
            case `edit`:
              if (!contextMenu.item) return
              return updateItem({
                ...values,
                id: contextMenu.item.id,
                price: Number(values.price),
                userId: user.id,
                categoryId: contextMenu.item.categoryId,
              })
            case `create`:
              return createItem({
                ...values,
                categoryId: categoryId ?? ``,
                userId: user.id,
                price: Number(values.price),
              })
            case `createSubItem`:
              if (!contextMenu.item) return
              return createSubItem({
                ...values,
                price: Number(values.price),
                userId: user.id,
                parentId: contextMenu.item.id,
                categoryId: contextMenu.item.categoryId,
              })
          }
        }}
        validationSchema={ItemInputSchema}
      >
        {({ errors, touched, values }) => (
          <StyledForm>
            <InputsContainer>
              <Input
                errors={errors.name}
                touched={touched.name}
                title="Name"
                field="name"
                placeholder="Name"
                value={values.name}
                maxLength={25}
                minLength={2}
              />
              <Input
                errors={errors.price}
                touched={touched.price}
                title="Price"
                field="price"
                fieldType="number"
                placeholder="Price"
                value={values.price}
              />
            </InputsContainer>
            <InputsContainer>
              <Input
                errors={errors.link}
                touched={touched.link}
                title="Link"
                field="link"
                placeholder="Link"
                value={values.link}
              />
            </InputsContainer>
            <MainButton type="submit">
              <p>{mode === `edit` ? `Save` : `Add`}</p>
            </MainButton>
          </StyledForm>
        )}
      </Formik>
    </Container>
  )
}

export default ItemModal

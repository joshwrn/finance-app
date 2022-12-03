import type { FC } from 'react'

import { Input } from '@components/FormFieldInput'
import { yupResolver } from '@hookform/resolvers/yup'
import { VALID_URL } from '@lib/zod'
import { useCreateItemMutation } from '@state/entities/item'
import { userState } from '@state/user'
import { FormProvider, useForm } from 'react-hook-form'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import * as Yup from 'yup'

import MainButton from '../Button'
import { Divider } from '../Divider'

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
const StyledForm = styled.form`
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

const CreateNewItemModal: FC<{
  categoryId: string
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ categoryId, setIsOpen }) => {
  const user = useRecoilValue(userState)
  const methods = useForm<InputValues>({
    mode: `all`,
    resolver: yupResolver(ItemInputSchema),
  })
  const { mutate } = useCreateItemMutation({
    categoryId,
    action: () => setIsOpen(false),
  })

  const onSubmit = (data: InputValues) => {
    mutate({
      ...data,
      categoryId,
      price: parseFloat(data.price),
      link: data.link || ``,
      userId: user.id,
    })
  }

  return (
    <Container>
      <h2>Create New Item</h2>
      <Divider />
      <FormProvider {...methods}>
        <StyledForm onSubmit={methods.handleSubmit(onSubmit)}>
          <InputsContainer>
            <Input field="name" title="Item Name" />
            <Input title="Price" field="price" type="number" />
          </InputsContainer>
          <InputsContainer>
            <Input title="Link" field="link" />
          </InputsContainer>
          <MainButton type="submit">
            <p>Add</p>
          </MainButton>
        </StyledForm>
      </FormProvider>
    </Container>
  )
}

export default CreateNewItemModal

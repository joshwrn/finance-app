import type { FC } from 'react'

import { Input } from '@components/FormFieldInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { asOptionalField, VALID_URL } from '@lib/zod'
import { useCreateItemMutation } from '@state/entities/item'
import { userState } from '@state/user'
import { useForm } from 'react-hook-form'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { z } from 'zod'

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

const zodSchema = z.object({
  name: z.string().min(2, `Too Short!`).max(25, `Too Long!`),
  price: z.string(),
  link: asOptionalField(z.string().regex(VALID_URL, `Invalid URL!`)),
})

const CreateNewItemModal: FC<{
  categoryId: string
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ categoryId, setIsOpen }) => {
  const user = useRecoilValue(userState)
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, touchedFields },
  } = useForm<InputValues>({
    mode: `all`,
    resolver: zodResolver(zodSchema),
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
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <InputsContainer>
          <Input
            errors={errors.name?.message}
            touched={touchedFields.name}
            field="name"
            title="Item Name"
            value={getValues(`name`)}
          >
            <input
              {...register(`name`, {
                required: {
                  value: true,
                  message: `Required!`,
                },
              })}
              autoComplete="off"
            />
          </Input>
          <Input
            title="Price"
            errors={errors.price?.message}
            touched={touchedFields.price}
            field="price"
            value={getValues(`price`)}
          >
            <input type="number" {...register(`price`)} autoComplete="off" />
          </Input>
        </InputsContainer>
        <InputsContainer>
          <Input
            title="Link"
            errors={errors.link?.message}
            touched={touchedFields.link}
            field="link"
            value={getValues(`link`)}
          >
            <input
              {...register(`link`, { required: false })}
              autoComplete="off"
            />
          </Input>
        </InputsContainer>
        <MainButton type="submit">
          <p>Add</p>
        </MainButton>
      </StyledForm>
    </Container>
  )
}

export default CreateNewItemModal

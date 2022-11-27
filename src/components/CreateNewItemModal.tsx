import { VALID_URL } from '@lib/yup'
import { userState } from '@state/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { trpc } from '@utils/trpc'
import axios from 'axios'
import { Formik, Form } from 'formik'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import * as Yup from 'yup'

import type { CategoryWithItems } from '~/prisma/prismaTypes'

import MainButton from './Button'
import { Divider } from './Divider'
import { Input } from './FormFieldInput'

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
  price: number
}
interface MutationArgs extends InputValues {
  categoryId: string
  userId: string
}

const ItemInputSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, `Too Short!`)
    .max(25, `Too Long!`)
    .required(`Required`),
  price: Yup.string().required(`Required`),
  link: Yup.string().matches(VALID_URL, `Invalid URL`),
})

const CreateNewItemModal = ({
  categoryId,
  setIsOpen,
}: {
  categoryId: string
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  const user = useRecoilValue(userState)
  const mutation = trpc.item.add.useMutation({
    onSuccess: (res) => {
      queryClient.setQueryData<{ categories: CategoryWithItems[] }>(
        [
          [`category`, `list`],
          {
            input: { userId: user.id, categoryType: `WISHLIST` },
            type: `query`,
          },
        ],
        (oldData) => {
          if (!oldData) return
          return {
            categories: [
              ...oldData.categories.map((category: CategoryWithItems) => {
                if (category.id === categoryId) {
                  return {
                    ...category,
                    items: [...category.items, res.item],
                  }
                }
                return category
              }),
            ],
          }
        },
      )
      setIsOpen(false)
    },
  })

  return (
    <Container>
      <h2>Create New Item</h2>
      <Divider />
      <Formik
        initialValues={{
          name: ``,
          link: ``,
          price: 0,
        }}
        onSubmit={(values: InputValues) => {
          mutation.mutate({ ...values, categoryId, userId: user.id })
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
                props={{ maxLength: 25, minLength: 2 }}
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
              <p>Add</p>
            </MainButton>
          </StyledForm>
        )}
      </Formik>
    </Container>
  )
}

export default CreateNewItemModal

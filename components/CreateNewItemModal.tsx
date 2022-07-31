import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Formik, Form } from 'formik'
import { useEffect } from 'react'
import styled from 'styled-components'
import * as Yup from 'yup'

import MainButton from './Button'
import { Divider } from './Divider'
import Input from './FormFieldInput'

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
interface MutationArgs extends InputValues {
  categoryId: string
  userId: string
}

const ItemInputSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, `Too Short!`)
    .max(50, `Too Long!`)
    .required(`Required`),
  link: Yup.string().url(`Invalid URL`),
  price: Yup.number().required(`Required`),
})

const CreateNewItemModal = ({
  categoryId,
  setIsOpen,
}: {
  categoryId: string
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const mutation = useMutation((newItem: MutationArgs) => {
    return axios.post(`/api/item/create`, newItem)
  })
  useEffect(() => {
    if (mutation.isSuccess) {
      return setIsOpen(false)
    }
  }, [mutation.isSuccess, setIsOpen])

  return (
    <Container>
      <h2>Create New Item</h2>
      <Divider />
      <Formik
        initialValues={{
          name: ``,
          link: ``,
          price: ``,
        }}
        onSubmit={(values: InputValues) => {
          mutation.mutate({ ...values, categoryId, userId: `1` })
        }}
        validationSchema={ItemInputSchema}
      >
        {({ errors, touched }) => (
          <StyledForm>
            <InputsContainer>
              <Input
                errors={errors.name}
                touched={touched.name}
                title="Name"
                field="name"
                placeholder="Name"
              />
              <Input
                errors={errors.link}
                touched={touched.link}
                title="Link"
                field="link"
                placeholder="Link"
              />
              <Input
                errors={errors.price}
                touched={touched.price}
                title="Price"
                field="price"
                fieldType="number"
                placeholder="Price"
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

import type { CategoryWithItems } from '@prisma/prismaTypes'
import { userState } from '@state/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Form, Formik } from 'formik'
import type { FC } from 'react'
import { useState } from 'react'
import React from 'react'
import { useRecoilValue } from 'recoil'
import * as Yup from 'yup'

import MainButton from './Button'
import { DropdownMenu } from './DropdownMenu'
import { Input } from './FormFieldInput'

const ItemInputSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, `Too Short!`)
    .max(25, `Too Long!`)
    .required(`Required`),
})

interface InputValues {
  name: string
}

interface MutationArgs extends InputValues {
  userId: string
  categoryType: string
}

export const NewCategoryButton: FC = () => {
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false)
  const user = useRecoilValue(userState)
  const queryClient = useQueryClient()
  const mutation = useMutation(
    (newItem: MutationArgs) => {
      return axios.post(`/api/category/create`, newItem)
    },
    {
      onSuccess: (res) => {
        queryClient.setQueryData<CategoryWithItems[]>(
          [`categories`],
          (oldData) => {
            if (!oldData) return
            return [...oldData, res.data.category]
          },
        )
      },
    },
  )
  return (
    <div style={{ position: `relative` }}>
      <DropdownMenu
        show={showNewCategoryModal}
        setShow={setShowNewCategoryModal}
        style={{ left: `-50%`, top: `calc(100% + 10px)` }}
      >
        <Formik
          initialValues={{
            name: ``,
          }}
          onSubmit={(values: InputValues) => {
            mutation.mutate({
              ...values,
              userId: user.id,
              categoryType: `WISHLIST`,
            })
          }}
          validationSchema={ItemInputSchema}
        >
          {({ errors, touched, values }) => (
            <Form>
              <Input
                errors={errors.name}
                touched={touched.name}
                field="name"
                placeholder="Name"
                value={values.name}
                props={{ maxLength: 25, minLength: 2, autoFocus: true }}
              />
              <button type="submit">
                <p>Add</p>
              </button>
            </Form>
          )}
        </Formik>
      </DropdownMenu>
      <MainButton onClick={() => setShowNewCategoryModal((prev) => !prev)}>
        <p>+ New List</p>
      </MainButton>
    </div>
  )
}
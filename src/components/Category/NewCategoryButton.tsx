import type { FC } from 'react'
import React, { useState } from 'react'

import { useCreateCategoryMutation } from '@state/entities/category'
import { userState } from '@state/user'
import { Form, Formik } from 'formik'
import { useRecoilValue } from 'recoil'
import * as Yup from 'yup'

import MainButton from '../Button'
import { DropdownMenu } from '../DropdownMenu'
import { Input } from '../FormFieldInput'

const InputSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, `Too Short!`)
    .max(25, `Too Long!`)
    .required(`Required`),
})

interface InputValues {
  name: string
}

export const NewCategoryButton: FC = () => {
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false)
  const user = useRecoilValue(userState)
  const { mutate } = useCreateCategoryMutation({
    action: () => setShowNewCategoryModal(false),
  })

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
            mutate({
              ...values,
              userId: user.id,
              categoryType: `WISHLIST`,
            })
          }}
          validationSchema={InputSchema}
        >
          {({ errors, touched, values }) => (
            <Form>
              <Input
                errors={errors.name}
                touched={touched.name}
                field="name"
                placeholder="Name"
                value={values.name}
                showError={false}
                maxLength={25}
                minLength={2}
                autoFocus={true}
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

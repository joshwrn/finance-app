import styled, { css } from 'styled-components'
import { Field } from 'formik'

const FieldContainer = styled.div<{ error?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  input {
    ${({ error }) =>
      error
        ? css`
            border: 1px solid var(--fc-error);
            :focus {
              border: 1px solid var(--fc-error);
            }
          `
        : css`
            border: 1px solid var(--bg-item);
            :focus {
              border: 1px solid var(--btn-primary);
            }
          `}
  }
  label {
    width: fit-content;
  }
`
const ErrorLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: var(--fc-error);
  font-size: 12px;
  padding-left: 7px;
  height: 20px;
  opacity: 0.9;
`

const Input = ({
  errors,
  touched,
  title,
  field,
  placeholder,
  fieldType = 'text',
}: {
  errors?: string
  touched?: boolean
  fieldType?: string
  title: string
  field: string
  placeholder: string
}) => {
  return (
    <FieldContainer error={Boolean(errors && touched)}>
      <label htmlFor={field}>{title}</label>
      <Field
        type={fieldType}
        id={field}
        name={field}
        placeholder={placeholder}
        autoComplete="off"
      />
      {errors && touched ? (
        <ErrorLabel>{errors}</ErrorLabel>
      ) : (
        <ErrorLabel></ErrorLabel>
      )}
    </FieldContainer>
  )
}

export default Input

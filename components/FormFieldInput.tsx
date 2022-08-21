import { Field } from 'formik'
import type { HTMLProps } from 'react'
import { BsPatchCheckFill, BsFillPatchExclamationFill } from 'react-icons/bs'
import styled, { css } from 'styled-components'

const FieldContainer = styled.div<{ error: boolean; isValid: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  position: relative;
  input {
    ${({ error, isValid }) => {
      if (error) {
        return css`
          border: 1px solid var(--fc-error);
          :focus {
            border: 1px solid var(--fc-error);
          }
        `
      }
      if (isValid) {
        return css`
          border: 1px solid var(--btn-primary);
          :focus {
            border: 1px solid var(--btn-primary);
          }
        `
      }
      return css`
        border: 1px solid var(--bg-item);
        :focus {
          border: 1px solid var(--btn-primary);
        }
      `
    }}
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

const Badge = styled.div<{ isValid: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ isValid }) =>
    isValid ? `var(--fc-alternate)` : `var(--fc-primary)`};
  svg {
    fill: ${({ isValid }) =>
      isValid ? `var(--btn-primary)` : `var(--fc-error)`};
    width: 17px;
    height: 17px;
  }
  font-size: 11px;
  font-weight: 600;
  height: 20px;
  width: 20px;
  position: absolute;
  right: 12px;
  top: 40px;
  border-radius: 50%;
`

const Input = ({
  props,
  errors,
  touched,
  title,
  field,
  placeholder,
  fieldType = `text`,
  value,
}: {
  props?: HTMLProps<HTMLInputElement>
  errors?: string
  touched?: boolean
  fieldType?: string
  title?: string
  field: string
  placeholder?: string
  value: string
}) => {
  const invalid = Boolean(errors && touched)
  const isValid = Boolean(!errors && value !== ``)
  return (
    <FieldContainer error={invalid} isValid={isValid}>
      <label htmlFor={field}>{title}</label>
      <Field
        type={fieldType}
        id={field}
        name={field}
        placeholder={placeholder}
        autoComplete="off"
        {...props}
      />
      {(invalid || isValid) && (
        <Badge isValid={isValid}>
          {isValid ? <BsPatchCheckFill /> : <BsFillPatchExclamationFill />}
        </Badge>
      )}
      <ErrorLabel>{invalid ? errors : ``}</ErrorLabel>
    </FieldContainer>
  )
}

export default Input

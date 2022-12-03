import type { FC, HTMLProps } from 'react'

import { Field } from 'formik'
import { BsPatchCheckFill, BsFillPatchExclamationFill } from 'react-icons/bs'
import styled, { css } from 'styled-components'

const FieldContainer = styled.div<{ error: boolean; isValid: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
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
          border: 1px solid var(--bg-item);
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
  top: 25%;
  border-radius: 50%;
  cursor: default;
  :hover {
    ${ErrorLabel} {
      opacity: 1;
    }
  }
  ${ErrorLabel} {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    position: absolute;
    right: 32px;
    background: var(--fc-error);
    color: var(--fc-primary);
    border-radius: 7px;
    padding: 5px 10px;
    transition: opacity 0.2s ease-in-out;
    width: fit-content;
    white-space: nowrap;
    pointer-events: none;
  }
`

export const Input: FC<
  HTMLProps<HTMLInputElement> & {
    errors?: string
    touched?: boolean
    fieldType?: string
    title?: string
    field: string
    placeholder?: string
    value: number | string
    showError?: boolean
  }
> = ({
  errors,
  touched,
  title,
  field,
  placeholder,
  fieldType = `text`,
  value,
  showError = true,
  ...props
}) => {
  const invalid = Boolean(errors && touched)
  const isValid = Boolean(!errors && value !== ``)
  return (
    <FieldContainer error={invalid} isValid={isValid}>
      {title && (
        <label style={{ marginBottom: `10px` }} htmlFor={field}>
          {title}
        </label>
      )}
      <div style={{ position: `relative` }}>
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
            {invalid && <ErrorLabel>{errors}</ErrorLabel>}
          </Badge>
        )}
      </div>
      {showError && <ErrorLabel>{invalid ? errors : ``}</ErrorLabel>}
    </FieldContainer>
  )
}

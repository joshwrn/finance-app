import { Divider } from './Divider'
import styled from 'styled-components'
import { Formik, Field, Form, FormikHelpers } from 'formik'
import MainButton from './Button'

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
  div {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 10px;
    label {
      width: fit-content;
    }
  }
`

const CreateNewItemModal = () => {
  return (
    <Container>
      <h2>Create New Item</h2>
      <Divider />
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
        }}
        onSubmit={() => {}}
      >
        <StyledForm>
          <InputsContainer>
            <div>
              <label htmlFor="itemInput">Item</label>
              <Field id="itemInput" name="itemInput" placeholder="ex: ipad" />
            </div>
            <div>
              <label htmlFor="linkInput">Link</label>
              <Field
                id="linkInput"
                name="linkInput"
                placeholder="ex: apple.com"
              />
            </div>
            <div>
              <label htmlFor="priceInput">Price</label>
              <Field id="priceInput" name="priceInput" placeholder="$-" />
            </div>
          </InputsContainer>
          <MainButton type="submit">Submit</MainButton>
        </StyledForm>
      </Formik>
    </Container>
  )
}

export default CreateNewItemModal

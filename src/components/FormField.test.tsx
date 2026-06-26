import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FormField, SelectInput, TextArea, TextInput } from './FormField'

describe('FormField', () => {
  it('renders label and children', () => {
    render(
      <FormField label="Naam">
        <TextInput placeholder="Vul in" />
      </FormField>,
    )
    expect(screen.getByText('Naam')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Vul in')).toBeInTheDocument()
  })

  it('shows error message when provided', () => {
    render(
      <FormField label="Naam" error="Verplicht veld">
        <TextInput />
      </FormField>,
    )
    expect(screen.getByText('Verplicht veld')).toBeInTheDocument()
  })

  it('renders textarea and select inputs', () => {
    render(
      <>
        <TextArea aria-label="omschrijving" />
        <SelectInput aria-label="type">
          <option value="a">A</option>
        </SelectInput>
      </>,
    )
    expect(screen.getByLabelText('omschrijving')).toBeInTheDocument()
    expect(screen.getByLabelText('type')).toBeInTheDocument()
  })
})

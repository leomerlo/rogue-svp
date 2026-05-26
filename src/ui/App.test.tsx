import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the hello world page', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Hello world' })).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import App from './App'
import { expect, test } from 'vitest'

test('smoke test de la app', () => {
  render(<App />)
  const pedidosElement = screen.getByText('Pedidos')
  expect(pedidosElement).toBeTruthy()
})
